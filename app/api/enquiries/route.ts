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

    await dbConnect();
    const doc = await Enquiry.create({
      name,
      mobile,
      email,
      message,
      category: category || undefined,
      source,
      status: "pending",
    });
    console.log("Enquiry saved", String(doc._id));

    // DB save is source of truth; email failure must not fail the form submit.
    await sendEnquiryEmail({
      id: String(doc._id),
      name,
      mobile,
      email,
      message,
      category: category || undefined,
      source,
    }).catch((error) => {
      console.error("Enquiry email unexpected error:", error);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry save failed:", error);
    return NextResponse.json({ error: "Could not send enquiry. Try again." }, { status: 500 });
  }
}
