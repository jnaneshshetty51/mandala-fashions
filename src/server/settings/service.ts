import { prisma } from "@/server/db";

const RAZORPAY_KEY_ID = "razorpay.key_id";
const RAZORPAY_KEY_SECRET = "razorpay.key_secret";

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
