import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { requireRequestRole } from "@/server/auth/guards";
import { listAdminBanners } from "@/server/admin/service";
import {
  createBanner,
  deleteBanner,
  publishBanner,
  unpublishBanner,
  updateBanner
} from "@/server/banners/service";

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

const createBannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  imageUrl: z.string().url().optional(),
  href: z.string().optional(),
  placement: z.string().min(2),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional()
});

const updateBannerSchema = createBannerSchema.partial();

export const adminBannersRouter = Router();

// GET / — list banners
adminBannersRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const banners = await listAdminBanners();
    res.json({ data: banners });
  })
);

// POST / — create banner
adminBannersRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const parsed = createBannerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input.", details: parsed.error.flatten() });
      return;
    }

    const banner = await createBanner(parsed.data);
    res.status(201).json({ data: banner });
  })
);

// PUT /:id — update banner
adminBannersRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);

    const parsed = updateBannerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input.", details: parsed.error.flatten() });
      return;
    }

    const banner = await updateBanner(id, parsed.data);
    res.json({ data: banner });
  })
);

// DELETE /:id — delete banner
adminBannersRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    await deleteBanner(id);
    res.json({ data: { deleted: true } });
  })
);

// PATCH /:id/publish — publish banner
adminBannersRouter.patch(
  "/:id/publish",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    const banner = await publishBanner(id);
    res.json({ data: banner });
  })
);

// PATCH /:id/unpublish — unpublish banner
adminBannersRouter.patch(
  "/:id/unpublish",
  asyncHandler(async (req: Request, res: Response) => {
    const user = requireRequestRole(req, res, ["ADMIN"]);
    if (!user) return;

    const id = String(req.params["id"]);
    const banner = await unpublishBanner(id);
    res.json({ data: banner });
  })
);

export const bannersPublicRouter = Router();

// GET /api/banners?placement=homepage.hero
bannersPublicRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const placement =
      typeof req.query["placement"] === "string" ? req.query["placement"] : undefined;
    const { getPublishedBanners } = await import("@/server/banners/service");
    const banners = await getPublishedBanners(placement);
    return res.json({ data: banners });
  })
);
