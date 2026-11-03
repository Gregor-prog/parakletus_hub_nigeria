/**
 * Backend-for-frontend proxy: /api/admin/proxy/<product>/<service>/<path>
 *
 * Lets console client components talk to product backends without the browser
 * ever seeing a backend URL or token. Each request is session-checked, mutations
 * must come from the console's own origin, and only the configured host is hit.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/admin/dal";
import { serviceFetch, serviceBaseUrl } from "@/lib/admin/backends";
import { getProduct } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ product: string; service: string; path: string[] }> };

const MAX_BODY_BYTES = 5 * 1024 * 1024;
// Request headers worth forwarding. Cookies and auth from the browser are never passed on.
const FORWARD_REQ = ["content-type", "accept", "accept-language", "if-none-match"];
const FORWARD_RES = ["content-type", "content-disposition", "etag", "last-modified", "x-total-count"];

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

async function handle(request: NextRequest, { params }: Ctx) {
  if (!(await getSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { product, service, path } = await params;
  const svc = getProduct(product)?.services.find((s) => s.key === service);
  if (!svc) return NextResponse.json({ error: "unknown service" }, { status: 404 });
  if (!serviceBaseUrl(svc)) return NextResponse.json({ error: `${svc.envPrefix}_API_URL is not set` }, { status: 503 });

  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && !sameOrigin(request)) {
    return NextResponse.json({ error: "cross-origin request refused" }, { status: 403 });
  }

  // Each segment arrives decoded; re-encode so "..", "?" or "#" can't escape the path.
  if (path.some((seg) => seg === ".." || seg === ".")) return NextResponse.json({ error: "bad path" }, { status: 400 });
  const subPath = path.map(encodeURIComponent).join("/") + request.nextUrl.search;

  const headers = new Headers();
  for (const h of FORWARD_REQ) {
    const v = request.headers.get(h);
    if (v) headers.set(h, v);
  }

  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.arrayBuffer();
    if (body.byteLength > MAX_BODY_BYTES) return NextResponse.json({ error: "body too large" }, { status: 413 });
  }

  try {
    const upstream = await serviceFetch(product, service, subPath, { method, headers, body });
    const out = new Headers({ "Cache-Control": "no-store" });
    for (const h of FORWARD_RES) {
      const v = upstream.headers.get(h);
      if (v) out.set(h, v);
    }
    // A redirect would point the browser at the backend directly; surface it instead.
    if (upstream.status >= 300 && upstream.status < 400) {
      return NextResponse.json({ error: "backend redirected", status: upstream.status }, { status: 502 });
    }
    return new NextResponse(upstream.body, { status: upstream.status, headers: out });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return NextResponse.json({ error: timedOut ? "backend timed out" : "backend unreachable" }, { status: timedOut ? 504 : 502 });
  }
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
