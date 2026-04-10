import { prisma } from "@/server/db";

const RAZORPAY_KEY_ID = "razorpay.key_id";
const RAZORPAY_KEY_SECRET = "razorpay.key_secret";

const RESEND_API_KEY = "resend.api_key";
const RESEND_FROM_EMAIL = "resend.from_email";
const RESEND_FROM_NAME = "resend.from_name";

export async function getRazorpaySettings() {
  let settings: Array<{ key: string; value: string }> = [];

  try {
    settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET]
        }
      }
    });
  } catch (error) {
    console.warn("Razorpay settings fallback to environment values.", error);
  }

  const map = new Map(settings.map((setting) => [setting.key, setting.value]));
  const keyId = map.get(RAZORPAY_KEY_ID) ?? process.env.RAZORPAY_KEY_ID ?? "";
  const keySecret = map.get(RAZORPAY_KEY_SECRET) ?? process.env.RAZORPAY_KEY_SECRET ?? "";

  return {
    keyId,
    keySecret,
    hasStoredSecret: Boolean(map.get(RAZORPAY_KEY_SECRET) || process.env.RAZORPAY_KEY_SECRET)
  };
}

export async function updateRazorpaySettings(input: { keyId: string; keySecret: string }) {
  await prisma.$transaction([
    prisma.appSetting.upsert({
      where: { key: RAZORPAY_KEY_ID },
      create: { key: RAZORPAY_KEY_ID, value: input.keyId.trim() },
      update: { value: input.keyId.trim() }
    }),
    prisma.appSetting.upsert({
      where: { key: RAZORPAY_KEY_SECRET },
      create: { key: RAZORPAY_KEY_SECRET, value: input.keySecret.trim() },
      update: { value: input.keySecret.trim() }
    })
  ]);

  return getRazorpaySettings();
}

export async function getResendSettings() {
  let rows: Array<{ key: string; value: string }> = [];
  try {
    rows = await prisma.appSetting.findMany({
      where: { key: { in: [RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME] } }
    });
  } catch {
    // fall back to env
  }

  const map = new Map(rows.map((r) => [r.key, r.value]));
  const apiKey = map.get(RESEND_API_KEY) ?? process.env.RESEND_API_KEY ?? "";
  const fromEmail = map.get(RESEND_FROM_EMAIL) ?? process.env.RESEND_FROM_EMAIL ?? "";
  const fromName = map.get(RESEND_FROM_NAME) ?? process.env.RESEND_FROM_NAME ?? "Mandala Fashions";

  return {
    apiKey,
    fromEmail,
    fromName,
    isConfigured: Boolean(apiKey && fromEmail),
    apiKeyMasked: apiKey ? `${apiKey.slice(0, 8)}••••••••` : ""
  };
}

export async function updateResendSettings(input: {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}) {
  await prisma.$transaction([
    prisma.appSetting.upsert({
      where: { key: RESEND_API_KEY },
      create: { key: RESEND_API_KEY, value: input.apiKey.trim() },
      update: { value: input.apiKey.trim() }
    }),
    prisma.appSetting.upsert({
      where: { key: RESEND_FROM_EMAIL },
      create: { key: RESEND_FROM_EMAIL, value: input.fromEmail.trim().toLowerCase() },
      update: { value: input.fromEmail.trim().toLowerCase() }
    }),
    prisma.appSetting.upsert({
      where: { key: RESEND_FROM_NAME },
      create: { key: RESEND_FROM_NAME, value: input.fromName.trim() || "Mandala Fashions" },
      update: { value: input.fromName.trim() || "Mandala Fashions" }
    })
  ]);

  return getResendSettings();
}

export async function testResendApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}
