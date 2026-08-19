import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { Enquiry, resolveEnquiryStatus } from "@/lib/models/Enquiry";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const items = await Enquiry.find().sort({ createdAt: -1 }).limit(500).lean();
    const mapped = items.map((item) => {
      const status = resolveEnquiryStatus(item);
      return {
        id: String(item._id),
        name: item.name,
        mobile: item.mobile,
        email: item.email,
        message: item.message,
        category: item.category ?? "",
        source: item.source,
        status,
        createdAt: item.createdAt,
      };
    });

    return NextResponse.json({
      total: mapped.length,
      pending: mapped.filter((item) => item.status === "pending").length,
      opened: mapped.filter((item) => item.status === "opened").length,
      resolved: mapped.filter((item) => item.status === "resolved").length,
      items: mapped,
    });
  } catch (error) {
    console.error("List enquiries failed:", error);
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 500 });
  }
}
