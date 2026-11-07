import { NextResponse } from "next/server";
import { sendEnquiryEmail } from "@/lib/email";
import { parseEnquiry } from "@/lib/enquiry-schema";
import { Enquiry } from "@/lib/models/Enquiry";
import { dbConnect } from "@/lib/mongodb";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = rateLimit(`enquiry:${clientIp(request)}`, 20, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = await request.json().catch(() => null);
    const parsed = parseEnquiry(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error, fields: parsed.fields },
        { status: 400 },
      );
    }

    const { name, mobile, email, message, category, source } = parsed.data;
    // Booking drafts are saved in the admin panel immediately; the admin is emailed
    // right away with a "payment pending" note, then again once payment succeeds.
    const notifyAdmin =
      typeof body === "object" && body !== null && "notifyAdmin" in body
        ? (body as { notifyAdmin?: unknown }).notifyAdmin !== false
        : true;
    const paymentPending =
      typeof body === "object" &&
      body !== null &&
      "paymentPending" in body &&
      (body as { paymentPending?: unknown }).paymentPending === true;

    await dbConnect();

    // Booking drafts: if the same customer resubmits the exact same draft while it
    // is still unpaid (e.g. after a page reload or in a new tab), reuse the existing
    // row instead of creating a duplicate and emailing the admin again.
    if (paymentPending) {
      const existing = await Enquiry.findOne({
        mobile,
        email,
        message,
        paymentPending: true,
        paid: { $ne: true },
      }).sort({ createdAt: -1 });

      if (existing) {
        existing.name = name;
        if (category) existing.category = category;
        existing.read = false;
        await existing.save();
        console.log("Payment-pending draft reused", String(existing._id));
        return NextResponse.json({ ok: true, id: String(existing._id), reused: true });
      }
    }

    const doc = await Enquiry.create({
      name,
      mobile,
      email,
      message,
      category: category || undefined,
      source,
      status: "pending",
      paymentPending,
    });
    console.log("Enquiry saved", String(doc._id));

    // DB save is source of truth; email failure must not fail the form submit.
    if (notifyAdmin) {
      await sendEnquiryEmail({
        id: String(doc._id),
        name,
        mobile,
        email,
        message,
        category: category || undefined,
        source,
        paymentPending,
      }).catch((error) => {
        console.error("Enquiry email unexpected error:", error);
      });
    }

    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (error) {
    console.error("Enquiry save failed:", error);
    return NextResponse.json({ error: "Could not send enquiry. Try again." }, { status: 500 });
  }
}
