"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminAuthConfigured, verifyAdminCredentials } from "@/lib/admin/credentials";
import { clearLoginFailures, loginBlockedFor, recordLoginFailure } from "@/lib/admin/rate-limit";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/admin/session";

export type LoginState = { error?: string } | undefined;

/** Only same-site relative paths, so `?next=` can't bounce an admin elsewhere. */
function safeNext(raw: FormDataEntryValue | null): string {
  const next = typeof raw === "string" ? raw : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/";
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// Server actions already reject cross-origin POSTs (Next compares Origin to Host).
export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!isAdminAuthConfigured()) {
    return {
      error:
        process.env.NODE_ENV === "production"
          ? "Sign-in is unavailable. Contact the site administrator."
          : "Admin sign-in isn't configured. Set ADMIN_USERNAME, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET in .env.local.",
    };
  }

  const ip = await clientIp();
  const wait = loginBlockedFor(ip);
  if (wait > 0) return { error: `Too many attempts. Try again in ${Math.ceil(wait / 60)} min.` };

  const username = String(form.get("username") ?? "").trim().slice(0, 128);
  const password = String(form.get("password") ?? "").slice(0, 512);

  const canonical = username && password ? await verifyAdminCredentials(username, password) : null;
  if (!canonical) {
    recordLoginFailure(ip);
    return { error: "That username and password don't match." };
  }

  const token = createSessionToken(canonical);
  if (!token) return { error: "Sign-in is unavailable. Contact the site administrator." };

  clearLoginFailures(ip);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
  redirect(safeNext(form.get("next")));
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/" });
  redirect("/login");
}
