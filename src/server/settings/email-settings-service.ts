import { prisma } from "@/server/db";

const RESEND_API_KEY = "resend.api_key";
const RESEND_FROM_EMAIL = "resend.from_email";

export async function getEmailSettings() {
  let settings: Array<{ key: string; value: string }> = [];

  try {
    settings = await prisma.appSetting.findMany({
      where: { key: { in: [RESEND_API_KEY, RESEND_FROM_EMAIL] } }
    });
  } catch {
    // DB unavailable
  }

  const map = new Map(settings.map((s) => [s.key, s.value]));

  return {
    apiKey: map.get(RESEND_API_KEY) ?? process.env.RESEND_API_KEY ?? "",
    fromEmail: map.get(RESEND_FROM_EMAIL) ?? process.env.RESEND_FROM_EMAIL ?? "Mandala Fashions <orders@mandala-fashions.com>",
    hasStoredKey: Boolean(map.get(RESEND_API_KEY) || process.env.RESEND_API_KEY)
  };
}

export async function updateEmailSettings(input: { apiKey?: string; fromEmail?: string }) {
  const ops = [];

  if (input.apiKey) {
    ops.push(
      prisma.appSetting.upsert({
        where: { key: RESEND_API_KEY },
        create: { key: RESEND_API_KEY, value: input.apiKey.trim() },
        update: { value: input.apiKey.trim() }
      })
    );
  }

  if (input.fromEmail) {
    ops.push(
      prisma.appSetting.upsert({
        where: { key: RESEND_FROM_EMAIL },
        create: { key: RESEND_FROM_EMAIL, value: input.fromEmail.trim() },
        update: { value: input.fromEmail.trim() }
      })
    );
  }

  if (ops.length > 0) {
    await prisma.$transaction(ops);
  }

  return getEmailSettings();
}
