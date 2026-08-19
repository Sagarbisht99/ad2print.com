import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { ENQUIRY_STATUSES, Enquiry } from "@/lib/models/Enquiry";
import { dbConnect } from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = String(body.status ?? "");
  if (!ENQUIRY_STATUSES.includes(status as (typeof ENQUIRY_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    await dbConnect();
    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { status, read: status !== "pending" },
      { new: true },
    );
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update enquiry failed:", error);
    return NextResponse.json({ error: "Could not update enquiry." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await dbConnect();
    await Enquiry.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete enquiry failed:", error);
    return NextResponse.json({ error: "Could not delete enquiry." }, { status: 500 });
  }
}
