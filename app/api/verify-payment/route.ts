import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendBookingToAdmin, sendPaymentConfirmation } from "@/lib/email";
import { Enquiry } from "@/lib/models/Enquiry";
import { dbConnect } from "@/lib/mongodb";
import { calculatePricing } from "@/lib/pricing";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { getRazorpayClient } from "@/lib/razorpay";

export const runtime = "nodejs";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

const verifySchema = z.object({
  razorpay_order_id: z.string().trim().min(1).max(120),
  razorpay_payment_id: z.string().trim().min(1).max(120),
  razorpay_signature: z.string().trim().regex(/^[a-f0-9]{64}$/i, "Invalid signature"),
  /** Admin-inbox id of the draft saved before payment. */
  enquiryId: z.string().trim().max(40).optional(),
  /** Full ad details typed by the customer. */
  message: z.string().trim().max(2000).optional(),
});

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function text(value: string | number | undefined) {
  return value === undefined ? "" : String(value).trim();
}

export async function POST(request: Request) {
  const limited = rateLimit(`verify-payment:${clientIp(request)}`, 20, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = await request.json().catch(() => null);
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment response." }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enquiryId, message } =
      parsed.data;
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) {
      console.error("Payment verification failed: RAZORPAY_KEY_SECRET is missing");
      return NextResponse.json({ error: "Payment verification is not configured." }, { status: 500 });
    }

    const expected = createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const { client } = getRazorpayClient();
    const [order, fetchedPayment] = await Promise.all([
      client.orders.fetch(razorpay_order_id),
      client.payments.fetch(razorpay_payment_id),
    ]);

    if (String(fetchedPayment.order_id) !== razorpay_order_id) {
      return NextResponse.json({ error: "Payment does not match this order." }, { status: 400 });
    }

    if (
      Number(fetchedPayment.amount) !== Number(order.amount) ||
      String(fetchedPayment.currency) !== String(order.currency)
    ) {
      return NextResponse.json({ error: "Payment amount does not match the order." }, { status: 400 });
    }

    let payment = fetchedPayment;

    // Manual-capture accounts return "authorized"; capture the money explicitly.
    if (String(payment.status) === "authorized") {
      try {
        payment = await client.payments.capture(
          razorpay_payment_id,
          Number(payment.amount),
          String(payment.currency),
        );
      } catch (error) {
        console.error("Payment capture failed:", error);
        return NextResponse.json(
          { error: "Payment is authorized but could not be captured. Please contact the desk." },
          { status: 502 },
        );
      }
    }

    if (String(payment.status) !== "captured") {
      return NextResponse.json({ error: "Payment is not successful yet." }, { status: 400 });
    }

    const notes = (order.notes ?? {}) as Record<string, string | number>;
    const email = text(notes.email);
    const name = text(notes.name) || "Customer";
    const mobile = text(notes.phone);
    const city = text(notes.city) || undefined;
    const papers = text(notes.papers) || undefined;
    const packageUnit = text(notes.package) || undefined;
    const purpose = text(notes.purpose) || papers;
    const amountPaise = Number(payment.amount);

    const baseRate = Number(notes.base_rate);
    const pricing =
      Number.isFinite(baseRate) && baseRate > 0 ? calculatePricing(baseRate) : null;

    const adminMessage =
      message?.trim() ||
      [
        "Paid booking on AD2PRINT",
        "",
        `Name: ${name}`,
        mobile ? `Mobile: ${mobile}` : "",
        email ? `Email: ${email}` : "",
        city ? `City: ${city}` : "",
        papers ? `Papers: ${papers}` : "",
        packageUnit ? `Package: ${packageUnit}` : "",
        `Total paid: ₹${(amountPaise / 100).toLocaleString("en-IN")}`,
        `Order ID: ${razorpay_order_id}`,
        `Payment ID: ${razorpay_payment_id}`,
      ]
        .filter((line) => line !== "")
        .join("\n");

    const warnings: string[] = [];
    const paidFields = {
      paid: true,
      paymentPending: false,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amountPaise,
      paidAt: new Date(),
    };

    // 1. Mark the draft (already in the admin panel) as paid.
    let savedToInbox = false;
    if (email && mobile) {
      try {
        await dbConnect();
        let updated = null;

        if (enquiryId && OBJECT_ID.test(enquiryId)) {
          updated = await Enquiry.findByIdAndUpdate(enquiryId, paidFields, { new: true });
        }

        if (!updated) {
          updated = await Enquiry.create({
            name,
            mobile,
            email,
            message: adminMessage.slice(0, 2000),
            category: `Paid booking${papers ? ` · ${papers}` : ""}`.slice(0, 120),
            source: "category",
            status: "pending",
            ...paidFields,
          });
        }

        savedToInbox = Boolean(updated);
      } catch (error) {
        console.error("Paid booking save failed:", error);
        warnings.push("Booking could not be saved to the admin inbox.");
      }
    } else {
      warnings.push("Booking could not be linked to the admin inbox.");
    }

    // 2. Notify the admin by email (draft email was intentionally skipped).
    let adminNotified = false;
    if (email && mobile) {
      const result = await sendBookingToAdmin({
        name,
        mobile,
        email,
        city,
        papers,
        packageUnit,
        amountPaise,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        message: adminMessage,
        pricing,
      }).catch((error) => {
        console.error("Admin booking email unexpected error:", error);
        return { ok: false as const, error };
      });

      adminNotified = result.ok;
      if (!result.ok) {
        warnings.push("Admin notification email could not be sent.");
      }
    }

    // 3. Send the paying customer their payment confirmation.
    let emailSent = false;
    if (email && validEmail(email)) {
      const result = await sendPaymentConfirmation({
        to: email,
        name,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amountPaise,
        currency: String(payment.currency),
        purpose,
        city,
        pricing,
      }).catch((error) => {
        console.error("Payment confirmation email unexpected error:", error);
        return { ok: false as const, error };
      });

      emailSent = result.ok;
      if (!result.ok) {
        warnings.push("Customer confirmation email could not be sent.");
      }
    } else {
      warnings.push("No customer email available for the confirmation.");
    }

    return NextResponse.json({
      ok: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: amountPaise,
      currency: String(payment.currency),
      emailSent,
      adminNotified,
      savedToInbox,
      pricing,
      ...(warnings.length ? { warning: warnings.join(" ") } : {}),
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Could not verify the payment. Please contact the desk." },
      { status: 500 },
    );
  }
}
