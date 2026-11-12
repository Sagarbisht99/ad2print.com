import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveBookingForService } from "@/lib/checkout";
import { calculatePricing } from "@/lib/pricing";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { getRazorpayClient, RAZORPAY_CURRENCY } from "@/lib/razorpay";

export const runtime = "nodejs";

const createOrderSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, "").slice(-10))
    .refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a valid 10-digit mobile number"),
  service: z.enum(["name-change", "matrimonial", "tender-notice"]).optional(),
  city: z.string().trim().min(1, "Select a city").max(200),
  papers: z
    .array(z.string().trim().min(1).max(120))
    .min(1, "Select at least one newspaper")
    .max(12),
  packageId: z.string().trim().max(60).optional(),
  purpose: z.string().trim().max(160).optional(),
});

function note(value: string | undefined, max = 250) {
  return value ? value.slice(0, max) : undefined;
}

export async function POST(request: Request) {
  const limited = rateLimit(`create-order:${clientIp(request)}`, 12, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = await request.json().catch(() => null);
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid checkout details" },
        { status: 400 },
      );
    }

    const { name, email, phone, service, city, papers, packageId, purpose } = parsed.data;

    // Amount is derived from the selected package on the server, never sent by the client.
    const booking = resolveBookingForService(service, city, papers, packageId);
    if (!booking) {
      return NextResponse.json(
        {
          error:
            "The rate for this newspaper selection is not available online. Please contact the desk.",
        },
        { status: 400 },
      );
    }

    const pricing = calculatePricing(booking.rate);
    const { client, keyId } = getRazorpayClient();
    const receipt = `ad2_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const order = await client.orders.create({
      amount: pricing.totalPaise,
      currency: RAZORPAY_CURRENCY,
      receipt,
      notes: {
        name: note(name, 80) ?? "",
        email: note(email, 160) ?? "",
        phone: note(phone, 20) ?? "",
        service: booking.service,
        city: note(booking.city, 80) ?? "",
        papers: note(booking.label) ?? "",
        package: note(booking.unit, 40) ?? "",
        base_rate: String(booking.rate),
        ...(purpose ? { purpose: note(purpose, 160) ?? "" } : {}),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      keyId,
      pricing: {
        basePaise: pricing.basePaise,
        gstPaise: pricing.gstPaise,
        conveniencePaise: pricing.conveniencePaise,
        totalPaise: pricing.totalPaise,
      },
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 500 },
    );
  }
}
