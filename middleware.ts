import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  // Match gsi.localhost:<port> and gsi.<any-domain> for live deployment
  const isGsi =
    hostname.startsWith("gsi.localhost") ||
    hostname.startsWith("gsi.");

  if (isGsi) {
    const url = request.nextUrl.clone();
    // Rewrite root to /gsi; preserve sub-paths like /gsi/something if needed later
    if (url.pathname === "/") {
      url.pathname = "/gsi";
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|api).*)"],
};
