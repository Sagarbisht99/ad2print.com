import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import { ADMIN_COOKIE, createAdminToken, verifyAdminToken } from "@/lib/auth-token";

export { ADMIN_COOKIE, createAdminToken, verifyAdminToken };

function adminUsername() {
  return process.env.ADMIN_USERNAME?.trim() ?? "";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function isAdminAuthConfigured() {
  return Boolean(adminUsername() && adminPassword());
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkAdminCredentials(username: string, password: string) {
  if (!isAdminAuthConfigured()) return false;
  return (
    safeEqual(username.trim().toLowerCase(), adminUsername().toLowerCase()) &&
    safeEqual(password, adminPassword())
  );
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
