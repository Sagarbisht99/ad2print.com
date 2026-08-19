import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkAdminCredentials,
  createAdminToken,
  isAdminAuthConfigured,
  sessionCookieOptions,
} from "@/lib/auth";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = rateLimit(`login:${clientIp(request)}`, 5, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const username = String(body.username ?? "");
    const password = String(body.password ?? "");

    if (!checkAdminCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = await createAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ error: "Login is not configured. Check server env." }, { status: 500 });
  }
}
