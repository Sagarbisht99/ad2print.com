import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "ad2print_admin";

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
    .setExpirationTime("7d")
    .sign(getAuthSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  return payload.role === "admin";
}
