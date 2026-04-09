// Must be first: Next.js 15 App Router requires AsyncLocalStorage on globalThis
import { AsyncLocalStorage } from "node:async_hooks";
(globalThis as unknown as Record<string, unknown>).AsyncLocalStorage ??= AsyncLocalStorage;

import dotenv from "dotenv";
import express from "express";
import next from "next";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getRequestSessionUser, requireRequestRole } from "@/server/auth/guards";
import {
  getAdminAnalyticsSnapshot,
  seedAdminShowcaseData
} from "@/server/admin/service";
import { AuthServiceError, authenticateUser, registerUser } from "@/server/auth/service";
import {
  createSessionToken,
  getSessionFromCookieHeader,
  serializeClearedSessionCookie,
  serializeSessionCookie
} from "@/server/auth/session";
import { prisma } from "@/server/db";
import { assertProductionEnv, getServerEnv, getStartupWarnings } from "@/server/env";
import { consumeRateLimit } from "@/server/http/rate-limit";
import { createOrder, OrderServiceError, trackOrder } from "@/server/orders/service";
import { createProduct, listProducts } from "@/server/products/service";
import { getRazorpaySettings, updateRazorpaySettings } from "@/server/settings/service";
import { storageBucket, minioClient } from "@/server/storage/config";
import { ensureBucket, uploadFileToStorage } from "@/server/storage/service";
import { adminOrdersRouter } from "@/server/routes/admin-orders-router";
import { adminProductsRouter } from "@/server/routes/admin-products-router";
import { adminCouponsRouter, couponPublicRouter } from "@/server/routes/admin-coupons-router";
import { adminBannersRouter, bannersPublicRouter } from "@/server/routes/admin-banners-router";
import { adminCustomersRouter } from "@/server/routes/admin-customers-router";

dotenv.config();

const env = getServerEnv();
assertProductionEnv(env);
const dev = env.NODE_ENV !== "production";
const hostname = env.HOST;
const port = env.PORT;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml"
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_UPLOAD_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("UNSUPPORTED_FILE_TYPE"));
    }
  }
});

const productSchema = z.object({
  category: z.string().min(2),
  material: z.string().min(2),
  type: z.string().min(2),
  variant: z.string().optional(),
  description: z.string().min(10),
  length: z.string().optional(),
  colors: z.string().optional(),
  price: z.coerce.number().positive(),
  sku: z.string().min(2),
  qty: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  shippingAddress: z.string().min(10),
  shippingAmount: z.coerce.number().min(0).optional(),
  discountAmount: z.coerce.number().min(0).optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    slug: z.string().optional(),
    name: z.string().min(2),
    color: z.string().optional(),
    variantName: z.string().optional(),
    quantity: z.coerce.number().int().positive(),
    unitPrice: z.coerce.number().positive()
  })).min(1)
});

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const trackOrderSchema = z.object({
  orderNumber: z.string().min(3),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(8).optional()
}).refine((value) => value.customerEmail || value.customerPhone, {
  message: "Provide the email address or phone number used during checkout.",
  path: ["customerEmail"]
});

const razorpaySettingsSchema = z.object({
  keyId: z.string().min(1),
  keySecret: z.string().min(1)
});

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

async function bootstrap() {
  getStartupWarnings(env).forEach((warning) => {
    console.warn(`[startup warning] ${warning}`);
  });

  await app.prepare();
  try {
    await ensureBucket();
  } catch (error) {
    console.warn("MinIO bucket check skipped during startup.", error);
  }

  const server = express();
  server.disable("x-powered-by");
  server.set("trust proxy", true);

  server.use(express.json({ limit: "1mb" }));
  server.use(express.urlencoded({ extended: true, limit: "1mb" }));
  server.use((req, res, nextMiddleware) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: *",
        "font-src 'self' data:",
        "connect-src 'self'",
        "frame-src https://checkout.razorpay.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join("; ")
    );

    nextMiddleware();
  });
  server.use("/api", (req, res, nextMiddleware) => {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const bucketKey = `${identifier}:${req.path}`;
    const result = consumeRateLimit(bucketKey, {
      windowMs: env.API_RATE_LIMIT_WINDOW_MS,
      maxRequests: env.API_RATE_LIMIT_MAX_REQUESTS
    });

    res.setHeader("X-RateLimit-Remaining", String(result.remaining));
    res.setHeader("X-RateLimit-Reset", String(result.resetAt));

    if (result.limited) {
      return res.status(429).json({ error: "Too many requests. Please try again shortly." });
    }

    nextMiddleware();
  });

  server.get("/api/health", async (_req, res) => {
    res.json({
      ok: true,
      service: "mandala-fashions",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  server.get("/api/ready", async (_req, res) => {
    const checks = {
      database: false,
      storage: false
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      console.error("Database readiness check failed", error);
    }

    try {
      checks.storage = await minioClient.bucketExists(storageBucket);
    } catch (error) {
      console.error("Storage readiness check failed", error);
    }

    const ready = checks.database && checks.storage;

    res.status(ready ? 200 : 503).json({
      ok: ready,
      checks,
      timestamp: new Date().toISOString()
    });
  });

  server.get("/api/auth/me", async (req, res) => {
    const user = getSessionFromCookieHeader(req.headers.cookie);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    return res.json({ data: user });
  });

  server.post("/api/auth/sign-up", asyncHandler(async (req, res) => {
    const parsed = signUpSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid sign-up payload.",
        details: parsed.error.flatten()
      });
    }

    try {
      const user = await registerUser(parsed.data);
      const token = createSessionToken(user);

      res.setHeader("Set-Cookie", serializeSessionCookie(token));
      return res.status(201).json({ data: user });
    } catch (error) {
      if (error instanceof AuthServiceError) {
        return res.status(409).json({ error: error.message });
      }

      throw error;
    }
  }));

  server.post("/api/auth/sign-in", asyncHandler(async (req, res) => {
    const parsed = signInSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid sign-in payload.",
        details: parsed.error.flatten()
      });
    }

    const user = await authenticateUser(parsed.data);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = createSessionToken(user);

    res.setHeader("Set-Cookie", serializeSessionCookie(token));
    return res.json({ data: user });
  }));

  server.post("/api/auth/sign-out", async (_req, res) => {
    res.setHeader("Set-Cookie", serializeClearedSessionCookie());
    return res.status(204).end();
  });

  server.post("/api/auth/forgot-password", asyncHandler(async (req, res) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid forgot-password payload.",
        details: parsed.error.flatten()
      });
    }

    return res.json({
      data: {
        message:
          "If an account exists for this email, recovery instructions will be available once email delivery is configured."
      }
    });
  }));

  server.use("/api/admin/orders", adminOrdersRouter);
  server.use("/api/admin/products", adminProductsRouter);
  server.use("/api/admin/coupons", adminCouponsRouter);
  server.use("/api/admin/banners", adminBannersRouter);
  server.use("/api/admin/customers", adminCustomersRouter);
  server.use("/api/coupons", couponPublicRouter);
  server.use("/api/banners", bannersPublicRouter);

  server.get("/api/admin/settings/razorpay", asyncHandler(async (req, res) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);

    if (!user) {
      return;
    }

    const settings = await getRazorpaySettings();

    return res.json({
      data: {
        keyId: settings.keyId,
        keySecretMasked: settings.keySecret ? "••••••••••••••••" : "",
        hasStoredSecret: settings.hasStoredSecret
      }
    });
  }));

  server.put("/api/admin/settings/razorpay", asyncHandler(async (req, res) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);

    if (!user) {
      return;
    }

    const parsed = razorpaySettingsSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid Razorpay settings payload.",
        details: parsed.error.flatten()
      });
    }

    const settings = await updateRazorpaySettings(parsed.data);

    return res.json({
      data: {
        keyId: settings.keyId,
        keySecretMasked: settings.keySecret ? "••••••••••••••••" : "",
        hasStoredSecret: settings.hasStoredSecret
      }
    });
  }));

  server.get("/api/admin/analytics", asyncHandler(async (req, res) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);

    if (!user) {
      return;
    }

    const snapshot = await getAdminAnalyticsSnapshot();
    return res.json({ data: snapshot });
  }));


  server.post("/api/admin/seed-showcase", asyncHandler(async (req, res) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);

    if (!user) {
      return;
    }

    const result = await seedAdminShowcaseData();
    return res.status(201).json({ data: result });
  }));

  server.get("/api/products", asyncHandler(async (_req, res) => {
    const products = await listProducts();
    res.json({ data: products });
  }));

  server.post("/api/products", asyncHandler(async (req, res) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);

    if (!user) {
      return;
    }

    const parsed = productSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid product payload",
        details: parsed.error.flatten()
      });
    }

    const product = await createProduct(parsed.data);
    return res.status(201).json({ data: product });
  }));

  server.post("/api/orders", asyncHandler(async (req, res) => {
    const parsed = orderSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid order payload",
        details: parsed.error.flatten()
      });
    }

    const sessionUser = getRequestSessionUser(req);
    const order = await createOrder({
      ...parsed.data,
      userId: sessionUser?.id
    });

    return res.status(201).json({ data: order });
  }));

  server.get("/api/orders/track", asyncHandler(async (req, res) => {
    const parsed = trackOrderSchema.safeParse({
      orderNumber: req.query.orderNumber,
      customerEmail: req.query.customerEmail,
      customerPhone: req.query.customerPhone
    });

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid track-order payload.",
        details: parsed.error.flatten()
      });
    }

    const order = await trackOrder(parsed.data);

    if (!order) {
      return res.status(404).json({ error: "Order not found for the details provided." });
    }

    return res.json({ data: order });
  }));

  server.post("/api/uploads", upload.single("file"), asyncHandler(async (req, res) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);

    if (!user) {
      return;
    }

    if (!req.file) {
      return res.status(400).json({ error: "A file is required." });
    }

    const result = await uploadFileToStorage(req.file);
    return res.status(201).json({ data: result });
  }));

  server.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof OrderServiceError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error instanceof AuthServiceError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed.",
        details: error.flatten()
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma request failed", error);
      return res.status(503).json({ error: "The service is temporarily unavailable. Please try again." });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({ error: "File too large. Maximum upload size is 10 MB." });
    }

    if (
      error instanceof Error &&
      error.message === "UNSUPPORTED_FILE_TYPE"
    ) {
      return res.status(415).json({ error: "Unsupported file type. Only JPEG, PNG, GIF, WebP, and SVG images are allowed." });
    }

    console.error("Request failed", error);
    res.status(500).json({ error: "Internal server error" });
  });

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap application", error);
  process.exit(1);
});
