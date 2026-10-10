import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "ad2print_admin";
export const ADMIN_SESSION_MINUTES = 40;
export const ADMIN_SESSION_SECONDS = ADMIN_SESSION_MINUTES * 60;

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set (16+ characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MINUTES}m`)
    .sign(getAuthSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  return payload.role === "admin";
}
