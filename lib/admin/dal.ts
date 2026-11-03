/**
 * Data-access-layer auth checks. proxy.ts already blocks signed-out requests,
 * but every admin page, action and route handler checks again here, so a
 * routing mistake or proxy bypass can't expose admin data on its own.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken, type AdminSession } from "./session";

export async function getSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** For pages and server actions: sends signed-out visitors to the login page. */
export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
