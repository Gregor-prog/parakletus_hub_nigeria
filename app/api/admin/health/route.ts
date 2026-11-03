import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/admin/dal";
import { checkAllServices } from "@/lib/admin/backends";
import { getProduct } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

/** GET /api/admin/health[?product=slug] — live status of every product service. */
export async function GET(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const product = request.nextUrl.searchParams.get("product") ?? undefined;
  if (product && !getProduct(product)) return NextResponse.json({ error: "unknown product" }, { status: 404 });

  return NextResponse.json(
    { services: await checkAllServices(product) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
