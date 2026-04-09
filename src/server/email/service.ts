import { Resend } from "resend";
import { getEmailSettings } from "@/server/settings/email-settings-service";
import {
  orderConfirmationTemplate,
  passwordResetTemplate,
  shippingNotificationTemplate
} from "@/server/email/templates";

async function getResendClient() {
  const settings = await getEmailSettings();
  if (!settings.apiKey) {
    throw new Error("Email service not configured. Set RESEND_API_KEY in admin settings.");
  }
  return { client: new Resend(settings.apiKey), fromEmail: settings.fromEmail };
}

type OrderSummary = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ productName: string; quantity: number; unitPriceLabel: string; totalPriceLabel: string }>;
  subtotalLabel: string;
  shippingAmountLabel: string;
  discountAmountLabel: string;
  totalAmountLabel: string;
  shippingAddress: string | null;
};

export async function sendOrderConfirmationEmail(order: OrderSummary) {
  const { client, fromEmail } = await getResendClient();

  await client.emails.send({
    from: fromEmail,
    to: [order.customerEmail],
    subject: `Order Confirmed — ${order.orderNumber} | Mandala Fashions`,
    html: orderConfirmationTemplate({
      ...order,
      shippingAddress: order.shippingAddress ?? "Not provided"
    })
  });
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string, appUrl: string) {
  const { client, fromEmail } = await getResendClient();
  const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  await client.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Reset your Mandala Fashions password",
    html: passwordResetTemplate(resetUrl, name)
  });
}

export async function sendShippingNotificationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingMessage: string;
}) {
  const { client, fromEmail } = await getResendClient();

  await client.emails.send({
    from: fromEmail,
    to: [order.customerEmail],
    subject: `Your order ${order.orderNumber} has been updated | Mandala Fashions`,
    html: shippingNotificationTemplate(order)
  });
}
