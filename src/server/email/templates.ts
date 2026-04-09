export function orderConfirmationTemplate(order: {
  orderNumber: string;
  customerName: string;
  items: Array<{ productName: string; quantity: number; unitPriceLabel: string; totalPriceLabel: string }>;
  subtotalLabel: string;
  shippingAmountLabel: string;
  discountAmountLabel: string;
  totalAmountLabel: string;
  shippingAddress: string;
}) {
  const itemRows = order.items.map((item) =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.productName}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.unitPriceLabel}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.totalPriceLabel}</td>
    </tr>`
  ).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Confirmation</title></head>
<body style="font-family:Georgia,serif;background:#f9f7f4;margin:0;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e8e3db;padding:40px">
    <h1 style="font-size:24px;font-weight:400;letter-spacing:0.05em;margin-bottom:4px">Mandala Fashions</h1>
    <p style="color:#888;font-size:14px;margin-bottom:32px">Heritage Sarees & Boutique Wear</p>

    <h2 style="font-size:18px;font-weight:400">Order Confirmed — ${order.orderNumber}</h2>
    <p>Dear ${order.customerName},</p>
    <p>Thank you for your purchase. Your order has been confirmed and is being prepared for dispatch.</p>

    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead>
        <tr style="background:#f4f0ea">
          <th style="padding:8px;text-align:left">Product</th>
          <th style="padding:8px;text-align:center">Qty</th>
          <th style="padding:8px;text-align:right">Unit</th>
          <th style="padding:8px;text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="border-top:2px solid #e8e3db;padding-top:16px;text-align:right">
      <p>Subtotal: ${order.subtotalLabel}</p>
      <p>Shipping: ${order.shippingAmountLabel}</p>
      ${order.discountAmountLabel !== "₹0" ? `<p>Discount: -${order.discountAmountLabel}</p>` : ""}
      <p><strong>Total: ${order.totalAmountLabel}</strong></p>
    </div>

    <p style="margin-top:24px"><strong>Shipping to:</strong><br>${order.shippingAddress}</p>
    <p style="color:#888;font-size:13px;margin-top:32px">Questions? Reply to this email or visit our support centre.</p>
  </div>
</body>
</html>`;
}

export function passwordResetTemplate(resetUrl: string, name: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reset Your Password</title></head>
<body style="font-family:Georgia,serif;background:#f9f7f4;margin:0;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e8e3db;padding:40px">
    <h1 style="font-size:24px;font-weight:400;letter-spacing:0.05em">Mandala Fashions</h1>
    <h2 style="font-size:18px;font-weight:400;margin-top:32px">Reset Your Password</h2>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password. Click the link below to set a new one. This link expires in 1 hour.</p>
    <p style="margin:32px 0">
      <a href="${resetUrl}" style="background:#1a1a1a;color:#fff;padding:12px 28px;text-decoration:none;letter-spacing:0.05em">
        Reset Password
      </a>
    </p>
    <p style="color:#888;font-size:13px">If you did not request this, you can safely ignore this email.</p>
  </div>
</body>
</html>`;
}

export function shippingNotificationTemplate(order: {
  orderNumber: string;
  customerName: string;
  trackingMessage: string;
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Update</title></head>
<body style="font-family:Georgia,serif;background:#f9f7f4;margin:0;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e8e3db;padding:40px">
    <h1 style="font-size:24px;font-weight:400;letter-spacing:0.05em">Mandala Fashions</h1>
    <h2 style="font-size:18px;font-weight:400;margin-top:32px">Order Update — ${order.orderNumber}</h2>
    <p>Dear ${order.customerName},</p>
    <p>${order.trackingMessage}</p>
    <p style="margin-top:24px">
      <a href="/track-order" style="background:#1a1a1a;color:#fff;padding:12px 28px;text-decoration:none">Track Order</a>
    </p>
    <p style="color:#888;font-size:13px;margin-top:32px">Questions? Visit our support centre.</p>
  </div>
</body>
</html>`;
}
