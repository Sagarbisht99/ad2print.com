import { Resend } from "resend";
import type { EnquiryInput } from "@/lib/enquiry-schema";

const SOURCE_LABEL: Record<EnquiryInput["source"], string> = {
  contact: "Contact page",
  popup: "Popup",
  category: "Category popup",
  newspaper: "Newspaper page",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendEnquiryEmail(enquiry: {
  name: string;
  mobile: string;
  email: string;
  message: string;
  category?: string;
  source: EnquiryInput["source"];
  id: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ADMIN_EMAIL?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "AD2PRINT Enquiries <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("Enquiry email skipped: RESEND_API_KEY or ADMIN_EMAIL missing");
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const source = SOURCE_LABEL[enquiry.source];
  const subject = `New enquiry from ${enquiry.name} (${source})`;
  const categoryLine = enquiry.category ? `Category: ${enquiry.category}\n` : "";
  const text = [
    "New enquiry received on AD2PRINT",
    "",
    `Name: ${enquiry.name}`,
    `Mobile: ${enquiry.mobile}`,
    `Email: ${enquiry.email}`,
    `Source: ${source}`,
    categoryLine.trimEnd(),
    "",
    "Message:",
    enquiry.message,
    "",
    `Enquiry ID: ${enquiry.id}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = enquiryEmailHtml({
    ...enquiry,
    sourceLabel: source,
  });

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: enquiry.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Enquiry email failed:", error);
    return { ok: false as const, error };
  }

  console.log("Enquiry email sent", data?.id);
  return { ok: true as const, id: data?.id };
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;width:110px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8b8e;vertical-align:top">${label}</td>
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
}) {
  const name = escapeHtml(enquiry.name);
  const mobile = escapeHtml(enquiry.mobile);
  const email = escapeHtml(enquiry.email);
  const source = escapeHtml(enquiry.sourceLabel);
  const category = enquiry.category ? escapeHtml(enquiry.category) : "";
  const message = escapeHtml(enquiry.message).replaceAll("\n", "<br/>");
  const id = escapeHtml(enquiry.id);
  const digits = enquiry.mobile.replace(/\D/g, "").slice(-10);
  const adminUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://ad2print.in").replace(/\/$/, "");
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
            <td style="background:#B21F2D;padding:22px 28px">
              <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#ffd5d8">AD2PRINT</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff">New enquiry received</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#ffd5d8">Saved in the admin inbox · ${source}</p>
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
              <a href="${adminUrl}/admin" style="display:inline-block;margin:0 0 8px;background:#ffffff;color:#2e2f32;text-decoration:none;font-size:13px;font-weight:700;padding:9px 16px;border-radius:999px;border:1px solid #d0d1d3">Open inbox</a>
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa;padding:14px 28px;border-top:1px solid #eee;font-size:12px;color:#8a8b8e">
              Enquiry ID ${id}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}