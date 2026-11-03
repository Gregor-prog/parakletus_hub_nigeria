import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/**
 * Host-based routing (Next 16 "proxy", formerly middleware; runs on Node).
 *
 *   gsi.<domain>    →  /gsi
 *   admin.<domain>  →  /admin/*   (signed-in only, except /login)
 *   <domain>/admin  →  404        (the console only exists on its subdomain)
 *
 * Locally: http://gsi.localhost:3002 and http://admin.localhost:3002
 */

// Public files (logos, favicon) are served as-is on every host.
const PUBLIC_FILE = /\.[a-z0-9]+$/i;

const ADMIN_HEADERS: Record<string, string> = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "no-store, max-age=0",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function withAdminHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(ADMIN_HEADERS)) res.headers.set(k, v);
  if (process.env.NODE_ENV === "production") {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }
  return res;
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin");
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname } = request.nextUrl;

  // ── admin.<domain> ──────────────────────────────────────────────
  if (host.startsWith("admin.")) {
    if (PUBLIC_FILE.test(pathname) && !pathname.startsWith("/api/")) return NextResponse.next();

    const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

    if (pathname.startsWith("/api/")) {
      if (!pathname.startsWith("/api/admin/")) return withAdminHeaders(new NextResponse(null, { status: 404 }));
      if (!session) return withAdminHeaders(NextResponse.json({ error: "unauthorized" }, { status: 401 }));
      return withAdminHeaders(NextResponse.next());
    }

    // Keep URLs clean on the subdomain: /admin/x → /x
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.slice("/admin".length) || "/";
      return NextResponse.redirect(url);
    }

    if (pathname === "/login") {
      if (session) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.search = "";
        return NextResponse.redirect(url);
      }
    } else if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      if (pathname !== "/") url.searchParams.set("next", pathname + request.nextUrl.search);
      return withAdminHeaders(NextResponse.redirect(url));
    }

    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/admin" : `/admin${pathname}`;
    return withAdminHeaders(NextResponse.rewrite(url));
  }

  // ── every other host: the console does not exist here ────────────
  if (isAdminPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/__not-found";
    return NextResponse.rewrite(url, { status: 404 });
  }

  // ── gsi.<domain> ────────────────────────────────────────────────
  if (host.startsWith("gsi.localhost") || host.startsWith("gsi.")) {
    const url = request.nextUrl.clone();
    if (url.pathname === "/") url.pathname = "/gsi";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon).*)"],
};
