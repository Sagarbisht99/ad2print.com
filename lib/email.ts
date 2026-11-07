import nodemailer, { type Transporter } from "nodemailer";
import type { EnquiryInput } from "@/lib/enquiry-schema";
import type { Pricing } from "@/lib/pricing";

const SOURCE_LABEL: Record<EnquiryInput["source"], string> = {
  contact: "Contact page",
  popup: "Popup",
  category: "Category popup",
  newspaper: "Newspaper page",
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ad2print.in").replace(/\/$/, "");
const DEFAULT_FROM = "AD2PRINT <no-reply@ad2print.in>";

let transporter: Transporter | null = null;

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1" || port === 465;

  if (!host || !user || !pass) return null;
  return { host, port, secure, user, pass };
}

function getTransporter() {
  if (transporter) return transporter;
  const config = smtpConfig();
  if (!config) return null;

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    tls: { minVersion: "TLSv1.2" },
  });

  return transporter;
}

function fromAddress() {
  return process.env.SMTP_FROM?.trim() || DEFAULT_FROM;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inr(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amountPaise / 100);
}

export async function sendEnquiryEmail(enquiry: {
  name: string;
  mobile: string;
  email: string;
  message: string;
  category?: string;
  source: EnquiryInput["source"];
  id: string;
  /** Booking draft saved but not paid yet — admin mail says "payment pending". */
  paymentPending?: boolean;
}) {
  const mailer = getTransporter();
  const to = process.env.ADMIN_EMAIL?.trim();

  if (!mailer || !to) {
    console.warn("Enquiry email skipped: SMTP_HOST/SMTP_USER/SMTP_PASS or ADMIN_EMAIL missing");
    return { ok: false as const, skipped: true as const };
  }

  const source = SOURCE_LABEL[enquiry.source];
  const paymentPending = Boolean(enquiry.paymentPending);
  const subject = paymentPending
    ? `Payment pending booking from ${enquiry.name} (${source})`
    : `New enquiry from ${enquiry.name} (${source})`;
  const categoryLine = enquiry.category ? `Category: ${enquiry.category}\n` : "";
  const text = [
    paymentPending
      ? "New booking draft on AD2PRINT — payment PENDING"
      : "New enquiry received on AD2PRINT",
    "",
    `Name: ${enquiry.name}`,
    `Mobile: ${enquiry.mobile}`,
    `Email: ${enquiry.email}`,
    `Source: ${source}`,
    categoryLine.trimEnd(),
    paymentPending
      ? "Payment status: PENDING — the customer has not completed payment yet."
      : "",
    "",
    "Message:",
    enquiry.message,
    "",
    `${paymentPending ? "Draft ID" : "Enquiry ID"}: ${enquiry.id}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  try {
    const info = await mailer.sendMail({
      from: fromAddress(),
      to,
      replyTo: enquiry.email,
      subject,
      text,
      html: enquiryEmailHtml({ ...enquiry, sourceLabel: source, paymentPending }),
    });
    console.log("Enquiry email sent", info.messageId);
    return { ok: true as const, id: info.messageId };
  } catch (error) {
    console.error("Enquiry email failed:", error);
    return { ok: false as const, error };
  }
}

export async function sendPaymentConfirmation(payment: {
  to: string;
  name: string;
  orderId: string;
  paymentId: string;
  amountPaise: number;
  currency: string;
  purpose?: string;
  city?: string;
  pricing?: Pricing | null;
}) {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn("Payment email skipped: SMTP_HOST/SMTP_USER/SMTP_PASS missing");
    return { ok: false as const, skipped: true as const };
  }

  const amount = inr(payment.amountPaise);
  const subject = `Payment successful — ${amount} received`;
  const text = [
    `Hi ${payment.name},`,
    "",
    "We have received your payment on AD2PRINT.",
    "",
    ...(payment.pricing
      ? [
          `Package rate: ${inr(payment.pricing.basePaise)}`,
          `GST (5%): ${inr(payment.pricing.gstPaise)}`,
          `Convenience fee (2.5% on rate + GST): ${inr(payment.pricing.conveniencePaise)}`,
        ]
      : []),
    `Total paid: ${amount}`,
    `Order ID: ${payment.orderId}`,
    `Payment ID: ${payment.paymentId}`,
    payment.purpose ? `Purpose: ${payment.purpose}` : "",
    payment.city ? `City: ${payment.city}` : "",
    "",
    "Our desk will confirm the publication details on WhatsApp. Keep this email for your records.",
    "",
    "Need help? Reply to this email or contact our desk.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  try {
    const info = await mailer.sendMail({
      from: fromAddress(),
      to: payment.to,
      subject,
      text,
      html: paymentEmailHtml({ ...payment, amount }),
    });
    console.log("Payment confirmation email sent", info.messageId);
    return { ok: true as const, id: info.messageId };
  } catch (error) {
    console.error("Payment confirmation email failed:", error);
    return { ok: false as const, error };
  }
}

export async function sendBookingToAdmin(booking: {
  name: string;
  mobile: string;
  email: string;
  city?: string;
  papers?: string;
  packageUnit?: string;
  amountPaise: number;
  orderId: string;
  paymentId: string;
  message: string;
  pricing?: Pricing | null;
}) {
  const mailer = getTransporter();
  const to = process.env.ADMIN_EMAIL?.trim();

  if (!mailer || !to) {
    console.warn("Admin booking email skipped: SMTP or ADMIN_EMAIL missing");
    return { ok: false as const, skipped: true as const };
  }

  const amount = inr(booking.amountPaise);
  const subject = `Paid booking ${amount} — ${booking.name}`;
  const text = [
    "New PAID booking on AD2PRINT",
    "",
    "Payment status: DONE — payment successfully captured.",
    "",
    ...(booking.pricing
      ? [
          `Package rate: ${inr(booking.pricing.basePaise)}`,
          `GST (5%): ${inr(booking.pricing.gstPaise)}`,
          `Convenience fee (2.5% on rate + GST): ${inr(booking.pricing.conveniencePaise)}`,
        ]
      : []),
    `Total paid: ${amount}`,
    `Order ID: ${booking.orderId}`,
    `Payment ID: ${booking.paymentId}`,
    "",
    `Name: ${booking.name}`,
    `Mobile: ${booking.mobile}`,
    `Email: ${booking.email}`,
    booking.city ? `City: ${booking.city}` : "",
    booking.papers ? `Papers: ${booking.papers}` : "",
    booking.packageUnit ? `Package: ${booking.packageUnit}` : "",
    "",
    "Booking details:",
    booking.message,
  ]
    .filter((line) => line !== "")
    .join("\n");

  try {
    const info = await mailer.sendMail({
      from: fromAddress(),
      to,
      replyTo: booking.email,
      subject,
      text,
      html: bookingEmailHtml({ ...booking, amount }),
    });
    console.log("Admin booking email sent", info.messageId);
    return { ok: true as const, id: info.messageId };
  } catch (error) {
    console.error("Admin booking email failed:", error);
    return { ok: false as const, error };
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;width:130px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8b8e;vertical-align:top">${label}</td>
      <td style="padding:10px 0;font-size:15px;color:#2e2f32;font-weight:600">${value}</td>
    </tr>
  `;
}

function enquiryEmailHtml(enquiry: {
  name: string;
  mobile: string;
  email: string;
  message: string;
  category?: string;
  sourceLabel: string;
  id: string;
  paymentPending?: boolean;
}) {
  const name = escapeHtml(enquiry.name);
  const mobile = escapeHtml(enquiry.mobile);
  const email = escapeHtml(enquiry.email);
  const source = escapeHtml(enquiry.sourceLabel);
  const category = enquiry.category ? escapeHtml(enquiry.category) : "";
  const message = escapeHtml(enquiry.message).replaceAll("\n", "<br/>");
  const id = escapeHtml(enquiry.id);
  const paymentPending = Boolean(enquiry.paymentPending);
  const headerColor = paymentPending ? "#B45309" : "#B21F2D";
  const headerTint = paymentPending ? "#fde9c9" : "#ffd5d8";
  const heading = paymentPending ? "New booking — payment pending" : "New enquiry received";
  const subline = paymentPending
    ? `Draft saved in the admin inbox · waiting for payment · ${source}`
    : `Saved in the admin inbox · ${source}`;
  const digits = enquiry.mobile.replace(/\D/g, "").slice(-10);
  const callHref = `tel:${enquiry.mobile.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/91${digits}`;
  const mailHref = `mailto:${enquiry.email}`;

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:28px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e6">
          <tr>
            <td style="background:${headerColor};padding:22px 28px">
              <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${headerTint}">AD2PRINT</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff">${heading}</h1>
              <p style="margin:8px 0 0;font-size:14px;color:${headerTint}">${subline}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #eee">
                ${row("Name", name)}
                ${row("Mobile", `<a href="${callHref}" style="color:#B21F2D;text-decoration:none">${mobile}</a>`)}
                ${row("Email", `<a href="${mailHref}" style="color:#B21F2D;text-decoration:none">${email}</a>`)}
                ${row("Source", source)}
                ${category ? row("Category", category) : ""}
                ${paymentPending ? row("Payment status", `<span style="color:#B45309">Pending — not paid yet</span>`) : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8b8e">Message</p>
              <div style="background:#fafafa;border:1px solid #eee;border-left:4px solid #B21F2D;border-radius:8px;padding:14px 16px;font-size:15px;line-height:1.6;color:#2e2f32">
                ${message}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px">
              <a href="${callHref}" style="display:inline-block;margin:0 8px 8px 0;background:#B21F2D;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 16px;border-radius:999px">Call</a>
              <a href="${waHref}" style="display:inline-block;margin:0 8px 8px 0;background:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 16px;border-radius:999px">WhatsApp</a>
              <a href="${mailHref}" style="display:inline-block;margin:0 8px 8px 0;background:#ffffff;color:#B21F2D;text-decoration:none;font-size:13px;font-weight:700;padding:9px 16px;border-radius:999px;border:1px solid #B21F2D">Reply email</a>
              <a href="${SITE_URL}/admin" style="display:inline-block;margin:0 0 8px;background:#ffffff;color:#2e2f32;text-decoration:none;font-size:13px;font-weight:700;padding:9px 16px;border-radius:999px;border:1px solid #d0d1d3">Open inbox</a>
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa;padding:14px 28px;border-top:1px solid #eee;font-size:12px;color:#8a8b8e">
              ${paymentPending ? "Booking draft" : "Enquiry"} ID ${id}${paymentPending ? " · payment not received yet" : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function paymentEmailHtml(payment: {
  name: string;
  orderId: string;
  paymentId: string;
  amount: string;
  purpose?: string;
  city?: string;
  pricing?: Pricing | null;
}) {
  const name = escapeHtml(payment.name);
  const orderId = escapeHtml(payment.orderId);
  const paymentId = escapeHtml(payment.paymentId);
  const purpose = payment.purpose ? escapeHtml(payment.purpose) : "";
  const city = payment.city ? escapeHtml(payment.city) : "";

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:28px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e6">
          <tr>
            <td style="background:#B21F2D;padding:22px 28px">
              <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#ffd5d8">AD2PRINT</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff">Payment successful</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#ffd5d8">Thank you, ${name}. We have received your payment.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #eee">
                ${payment.pricing ? row("Package rate", inr(payment.pricing.basePaise)) : ""}
                ${payment.pricing ? row("GST (5%)", inr(payment.pricing.gstPaise)) : ""}
                ${payment.pricing ? row("Convenience fee (2.5% on rate + GST)", inr(payment.pricing.conveniencePaise)) : ""}
                ${row("Total paid", payment.amount)}
                ${row("Order ID", orderId)}
                ${row("Payment ID", paymentId)}
                ${purpose ? row("Purpose", purpose) : ""}
                ${city ? row("City", city) : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#2e2f32">
                Our desk will confirm the publication details on WhatsApp. Keep this email for your
                records.
              </p>
              <a href="${SITE_URL}/contact" style="display:inline-block;margin-top:18px;background:#B21F2D;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 16px;border-radius:999px">Contact the desk</a>
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa;padding:14px 28px;border-top:1px solid #eee;font-size:12px;color:#8a8b8e">
              This is an automated payment confirmation from AD2PRINT.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function bookingEmailHtml(booking: {
  name: string;
  mobile: string;
  email: string;
  city?: string;
  papers?: string;
  packageUnit?: string;
  amount: string;
  orderId: string;
  paymentId: string;
  message: string;
  pricing?: Pricing | null;
}) {
  const name = escapeHtml(booking.name);
  const mobile = escapeHtml(booking.mobile);
  const email = escapeHtml(booking.email);
  const city = booking.city ? escapeHtml(booking.city) : "";
  const papers = booking.papers ? escapeHtml(booking.papers) : "";
  const packageUnit = booking.packageUnit ? escapeHtml(booking.packageUnit) : "";
  const orderId = escapeHtml(booking.orderId);
  const paymentId = escapeHtml(booking.paymentId);
  const message = escapeHtml(booking.message).replaceAll("\n", "<br/>");
  const digits = booking.mobile.replace(/\D/g, "").slice(-10);
  const callHref = `tel:${booking.mobile.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/91${digits}`;
  const mailHref = `mailto:${booking.email}`;

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:28px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e6">
          <tr>
            <td style="background:#0f7a3d;padding:22px 28px">
              <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#d6f5e3">AD2PRINT</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff">New paid booking</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#d6f5e3">${booking.amount} received · ${name}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #eee">
                ${booking.pricing ? row("Package rate", inr(booking.pricing.basePaise)) : ""}
                ${booking.pricing ? row("GST (5%)", inr(booking.pricing.gstPaise)) : ""}
                ${booking.pricing ? row("Convenience fee (2.5% on rate + GST)", inr(booking.pricing.conveniencePaise)) : ""}
                ${row("Total paid", booking.amount)}
                ${row("Order ID", orderId)}
                ${row("Payment ID", paymentId)}
                ${row("Payment status", `<span style="color:#0f7a3d">Done — payment captured</span>`)}
                ${row("Name", name)}
                ${row("Mobile", `<a href="${callHref}" style="color:#B21F2D;text-decoration:none">${mobile}</a>`)}
                ${row("Email", `<a href="${mailHref}" style="color:#B21F2D;text-decoration:none">${email}</a>`)}
                ${city ? row("City", city) : ""}
                ${papers ? row("Papers", papers) : ""}
                ${packageUnit ? row("Package", packageUnit) : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8b8e">Booking details</p>
              <div style="background:#fafafa;border:1px solid #eee;border-left:4px solid #0f7a3d;border-radius:8px;padding:14px 16px;font-size:15px;line-height:1.6;color:#2e2f32">
                ${message}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px">
              <a href="${callHref}" style="display:inline-block;margin:0 8px 8px 0;background:#B21F2D;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 16px;border-radius:999px">Call</a>
              <a href="${waHref}" style="display:inline-block;margin:0 8px 8px 0;background:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 16px;border-radius:999px">WhatsApp</a>
              <a href="${mailHref}" style="display:inline-block;margin:0 8px 8px 0;background:#ffffff;color:#B21F2D;text-decoration:none;font-size:13px;font-weight:700;padding:9px 16px;border-radius:999px;border:1px solid #B21F2D">Reply email</a>
              <a href="${SITE_URL}/admin" style="display:inline-block;margin:0 0 8px;background:#ffffff;color:#2e2f32;text-decoration:none;font-size:13px;font-weight:700;padding:9px 16px;border-radius:999px;border:1px solid #d0d1d3">Open inbox</a>
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa;padding:14px 28px;border-top:1px solid #eee;font-size:12px;color:#8a8b8e">
              Payment captured · this booking is also saved in the admin inbox.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
