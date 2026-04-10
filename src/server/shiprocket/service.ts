import { prisma } from "@/server/db";

const SHIPROCKET_API = "https://apiv2.shiprocket.in/v1/external";

const SETTING_EMAIL = "shiprocket.email";
const SETTING_PASSWORD = "shiprocket.password";
const SETTING_PICKUP_LOCATION = "shiprocket.pickup_location";
const SETTING_CHANNEL_ID = "shiprocket.channel_id";
const SETTING_DEFAULT_CITY = "shiprocket.default_city";
const SETTING_DEFAULT_STATE = "shiprocket.default_state";
const SETTING_DEFAULT_PINCODE = "shiprocket.default_pincode";

// In-memory token cache (refreshed every 22 hours, token expires at 24h)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export type ShiprocketSettings = {
  email: string;
  password: string;
  pickupLocation: string;
  channelId: string;
  defaultCity: string;
  defaultState: string;
  defaultPincode: string;
  isConfigured: boolean;
};

export async function getShiprocketSettings(): Promise<ShiprocketSettings> {
  let rows: Array<{ key: string; value: string }> = [];
  try {
    rows = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            SETTING_EMAIL,
            SETTING_PASSWORD,
            SETTING_PICKUP_LOCATION,
            SETTING_CHANNEL_ID,
            SETTING_DEFAULT_CITY,
            SETTING_DEFAULT_STATE,
            SETTING_DEFAULT_PINCODE
          ]
        }
      }
    });
  } catch {
    // DB unavailable — fall back to env
  }

  const map = new Map(rows.map((r) => [r.key, r.value]));
  const email = map.get(SETTING_EMAIL) ?? process.env.SHIPROCKET_EMAIL ?? "";
  const password = map.get(SETTING_PASSWORD) ?? process.env.SHIPROCKET_PASSWORD ?? "";

  return {
    email,
    password,
    pickupLocation: map.get(SETTING_PICKUP_LOCATION) ?? process.env.SHIPROCKET_PICKUP_LOCATION ?? "Primary",
    channelId: map.get(SETTING_CHANNEL_ID) ?? process.env.SHIPROCKET_CHANNEL_ID ?? "",
    defaultCity: map.get(SETTING_DEFAULT_CITY) ?? process.env.SHIPROCKET_DEFAULT_CITY ?? "",
    defaultState: map.get(SETTING_DEFAULT_STATE) ?? process.env.SHIPROCKET_DEFAULT_STATE ?? "",
    defaultPincode: map.get(SETTING_DEFAULT_PINCODE) ?? process.env.SHIPROCKET_DEFAULT_PINCODE ?? "",
    isConfigured: Boolean(email && password)
  };
}

export async function updateShiprocketSettings(input: {
  email: string;
  password: string;
  pickupLocation: string;
  channelId?: string;
  defaultCity?: string;
  defaultState?: string;
  defaultPincode?: string;
}) {
  const upserts = [
    prisma.appSetting.upsert({
      where: { key: SETTING_EMAIL },
      create: { key: SETTING_EMAIL, value: input.email.trim() },
      update: { value: input.email.trim() }
    }),
    prisma.appSetting.upsert({
      where: { key: SETTING_PASSWORD },
      create: { key: SETTING_PASSWORD, value: input.password.trim() },
      update: { value: input.password.trim() }
    }),
    prisma.appSetting.upsert({
      where: { key: SETTING_PICKUP_LOCATION },
      create: { key: SETTING_PICKUP_LOCATION, value: input.pickupLocation.trim() || "Primary" },
      update: { value: input.pickupLocation.trim() || "Primary" }
    })
  ];

  if (input.channelId !== undefined) {
    upserts.push(
      prisma.appSetting.upsert({
        where: { key: SETTING_CHANNEL_ID },
        create: { key: SETTING_CHANNEL_ID, value: input.channelId.trim() },
        update: { value: input.channelId.trim() }
      })
    );
  }

  if (input.defaultCity !== undefined) {
    upserts.push(
      prisma.appSetting.upsert({
        where: { key: SETTING_DEFAULT_CITY },
        create: { key: SETTING_DEFAULT_CITY, value: input.defaultCity.trim() },
        update: { value: input.defaultCity.trim() }
      })
    );
  }

  if (input.defaultState !== undefined) {
    upserts.push(
      prisma.appSetting.upsert({
        where: { key: SETTING_DEFAULT_STATE },
        create: { key: SETTING_DEFAULT_STATE, value: input.defaultState.trim() },
        update: { value: input.defaultState.trim() }
      })
    );
  }

  if (input.defaultPincode !== undefined) {
    upserts.push(
      prisma.appSetting.upsert({
        where: { key: SETTING_DEFAULT_PINCODE },
        create: { key: SETTING_DEFAULT_PINCODE, value: input.defaultPincode.trim() },
        update: { value: input.defaultPincode.trim() }
      })
    );
  }

  // Invalidate token when credentials change
  cachedToken = null;
  tokenExpiresAt = 0;

  await prisma.$transaction(upserts);
  return getShiprocketSettings();
}

async function authenticate(email: string, password: string): Promise<string> {
  const response = await fetch(`${SHIPROCKET_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "Shiprocket authentication failed.");
  }

  const data = (await response.json()) as { token: string };
  return data.token;
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const settings = await getShiprocketSettings();
  if (!settings.isConfigured) {
    throw new Error("Shiprocket credentials are not configured. Set them in Admin → Settings.");
  }

  const token = await authenticate(settings.email, settings.password);
  cachedToken = token;
  tokenExpiresAt = Date.now() + 22 * 60 * 60 * 1000; // 22 hours
  return token;
}

function parsePincode(address: string): string {
  const match = address.match(/\b(\d{6})\b/);
  return match?.[1] ?? "";
}

// Best-effort: split "Line1, City, State - Pincode" into parts
function parseAddress(address: string) {
  const lines = address.split(/\n|,/).map((l) => l.trim()).filter(Boolean);
  const pincode = parsePincode(address);

  // Remove pincode from last line to find state/city
  const lastLine = lines[lines.length - 1] ?? "";
  const withoutPin = lastLine.replace(/\s*-?\s*\d{6}/, "").trim();
  const parts = withoutPin.split(/\s+-\s+/);
  const city = parts[0]?.trim() ?? "";
  const state = parts[1]?.trim() ?? "";

  // First line(s) are the street address
  const street = lines.slice(0, Math.max(1, lines.length - 1)).join(", ");

  return { street, city, state, pincode };
}

export type ShiprocketCreateResult = {
  shiprocketOrderId: string;
  awb: string | null;
  status: string;
  courierName: string | null;
};

export async function createShiprocketShipment(orderId: string): Promise<ShiprocketCreateResult> {
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    }),
    getShiprocketSettings()
  ]);

  if (!order) throw new Error("Order not found.");
  if (order.shiprocketOrderId) throw new Error("Shipment already created for this order.");

  const token = await getToken();

  const addressRaw = order.shippingAddress ?? "";
  const parsed = parseAddress(addressRaw);

  const city = parsed.city || settings.defaultCity;
  const state = parsed.state || settings.defaultState;
  const pincode = parsed.pincode || settings.defaultPincode;
  const phone = order.customerPhone ?? "9999999999";
  const [firstName, ...rest] = order.customerName.trim().split(" ");
  const lastName = rest.join(" ") || ".";

  const orderItems = order.items.map((item) => ({
    name: item.product.name,
    sku: item.product.sku,
    units: item.quantity,
    selling_price: String(Number(item.unitPrice)),
    discount: "",
    tax: "",
    hsn: ""
  }));

  const subtotal = Number(order.totalAmount);
  const paymentMethod = (order.paymentMethod ?? "cod").toLowerCase().includes("cod") ? "COD" : "Prepaid";

  const orderDate = order.placedAt.toISOString().replace("T", " ").slice(0, 16);

  const payload: Record<string, unknown> = {
    order_id: order.orderNumber,
    order_date: orderDate,
    pickup_location: settings.pickupLocation,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: parsed.street || addressRaw,
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: "India",
    billing_email: order.customerEmail,
    billing_phone: phone,
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: paymentMethod,
    sub_total: subtotal,
    length: 30,
    breadth: 20,
    height: 10,
    weight: 0.5
  };

  if (settings.channelId) {
    payload.channel_id = settings.channelId;
  }

  const response = await fetch(`${SHIPROCKET_API}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json().catch(() => null)) as {
    order_id?: number;
    shipment_id?: number;
    status?: string;
    awb_code?: string;
    courier_name?: string;
    message?: string;
    errors?: unknown;
  } | null;

  if (!response.ok || !data?.order_id) {
    const msg = typeof data?.message === "string"
      ? data.message
      : "Failed to create Shiprocket shipment.";
    throw new Error(msg);
  }

  const shiprocketOrderId = String(data.order_id);
  const awb = data.awb_code ?? null;
  const status = data.status ?? "NEW";
  const courierName = data.courier_name ?? null;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      shiprocketOrderId,
      shiprocketAwb: awb,
      shiprocketStatus: status,
      status: "PROCESSING"
    }
  });

  return { shiprocketOrderId, awb, status, courierName };
}

export type ShiprocketTrackingResult = {
  awb: string;
  status: string;
  currentStatus: string;
  estimatedDelivery: string | null;
  activities: Array<{ date: string; activity: string; location: string }>;
};

export async function getShiprocketTracking(awb: string): Promise<ShiprocketTrackingResult> {
  const token = await getToken();

  const response = await fetch(`${SHIPROCKET_API}/courier/track/awb/${awb}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tracking from Shiprocket.");
  }

  const data = (await response.json()) as {
    tracking_data?: {
      track_status?: number;
      current_status?: string;
      estimated_delivery_date?: string;
      shipment_track_activities?: Array<{
        date: string;
        activity: string;
        location: string;
      }>;
    };
  };

  const td = data.tracking_data ?? {};
  return {
    awb,
    status: String(td.track_status ?? ""),
    currentStatus: td.current_status ?? "Pending",
    estimatedDelivery: td.estimated_delivery_date ?? null,
    activities: (td.shipment_track_activities ?? []).map((a) => ({
      date: a.date,
      activity: a.activity,
      location: a.location
    }))
  };
}

export async function cancelShiprocketShipment(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order?.shiprocketOrderId) throw new Error("No Shiprocket shipment found for this order.");

  const token = await getToken();

  const response = await fetch(`${SHIPROCKET_API}/orders/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ids: [Number(order.shiprocketOrderId)] })
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message ?? "Failed to cancel Shiprocket shipment.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      shiprocketOrderId: null,
      shiprocketAwb: null,
      shiprocketStatus: "CANCELLED"
    }
  });
}

export async function testShiprocketCredentials(email: string, password: string): Promise<boolean> {
  try {
    await authenticate(email, password);
    return true;
  } catch {
    return false;
  }
}
