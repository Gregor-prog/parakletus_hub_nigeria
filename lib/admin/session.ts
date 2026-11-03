/**
 * Stateless admin sessions.
 *
 * A session is `base64url(payload).base64url(HMAC-SHA256(payload))`, stored in an
 * HttpOnly, SameSite=Strict, host-only cookie. Nothing is stored server-side, so
 * rotating ADMIN_SESSION_SECRET signs every admin out at once.
 *
 * Used by proxy.ts (Node runtime in Next 16), server components, server actions
 * and route handlers. Never import this from a client component.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_SECONDS = 60 * 60 * 8; // one working day

const isProd = process.env.NODE_ENV === "production";

/** `__Host-` forces Secure + Path=/ + no Domain, so the cookie can never leak to
 *  parakletushub.com or gsi.parakletushub.com. Plain http dev can't use it. */
export const SESSION_COOKIE = isProd ? "__Host-phn_admin" : "phn_admin";

export type AdminSession = {
  sub: string; // admin username
  iat: number; // issued at (unix seconds)
  exp: number; // expires at (unix seconds)
};

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // Fail closed: a short or missing secret means nobody can sign in.
  if (!secret || secret.length < 32) return null;
  return secret;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(username: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = { sub: username, iat: now, exp: now + SESSION_TTL_SECONDS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;

  const dot = token.indexOf(".");
  if (dot <= 0 || dot !== token.lastIndexOf(".")) return null;
  const body = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1), "base64url");
  const expected = Buffer.from(sign(body, secret), "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AdminSession;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    // A session for a username that is no longer configured is void.
    if (payload.sub !== process.env.ADMIN_USERNAME) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
