import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { requireSession } from "@/lib/admin/dal";
import { getHealth } from "@/lib/admin/health";
import { isServiceConfigured } from "@/lib/admin/backends";
import { PRODUCTS, type Product } from "@/lib/admin/products";
import { RefreshButton } from "../_components/client";
import { ArrowIcon, HealthPill, PageHead, StatusTag, healthDetail } from "../_components/ui";

export const metadata: Metadata = { title: "Overview" };

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "numeric", hour12: false }).format(new Date()),
  );
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

async function LiveStats() {
  const health = await getHealth();
  const online = health.filter((h) => h.state === "online");
  const attention = health.filter((h) => h.state === "offline" || h.state === "degraded");
  const avg = online.length ? Math.round(online.reduce((n, h) => n + (h.latencyMs ?? 0), 0) / online.length) : null;
  return (
    <>
      <div className="stat">
        <span className="stat__label">Services online</span>
        <span className="stat__num">{online.length}</span>
        <span className="stat__note">of {health.length} services</span>
      </div>
      <div className={`stat ${attention.length ? "stat--alert" : ""}`}>
        <span className="stat__label">Need attention</span>
        <span className="stat__num">{attention.length}</span>
        <span className="stat__note">{attention.length ? "offline or erroring" : "all clear"}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Avg. response</span>
        <span className="stat__num">
          {avg ?? "—"}
          {avg !== null && <small> ms</small>}
        </span>
        <span className="stat__note">across online services</span>
      </div>
    </>
  );
}

function StatsFallback() {
  return (
    <>
      {["Services online", "Need attention", "Avg. response"].map((l) => (
        <div className="stat stat--loading" key={l}>
          <span className="stat__label">{l}</span>
          <span className="stat__num">·</span>
          <span className="stat__note">checking…</span>
        </div>
      ))}
    </>
  );
}

async function CardHealth({ product }: { product: Product }) {
  const health = (await getHealth()).filter((h) => h.product === product.slug);
  return (
    <ul className="card__services">
      {product.services.map((s) => {
        const h = health.find((x) => x.service === s.key);
        return (
          <li key={s.key}>
            <span className="card__svc">{s.label}</span>
            {h ? <HealthPill state={h.state} detail={healthDetail(h)} /> : <HealthPill state="checking" />}
          </li>
        );
      })}
    </ul>
  );
}

function ProductCard({ product }: { product: Product }) {
  const hasServices = product.services.length > 0;
  return (
    <Link href={`/products/${product.slug}`} className={`card card--${product.accent} card--${product.status}`}>
      <div className="card__head">
        <span className="card__logo">
          {product.logo ? <img src={product.logo} alt="" /> : <span className="card__mono">{product.code.slice(0, 2)}</span>}
        </span>
        <StatusTag status={product.status} />
      </div>
      <span className="card__code">{product.code} · {product.sector}</span>
      <h3 className="card__name">{product.name}</h3>
      <p className="card__tagline">{product.tagline}</p>

      {hasServices ? (
        <Suspense
          fallback={
            <ul className="card__services">
              {product.services.map((s) => (
                <li key={s.key}>
                  <span className="card__svc">{s.label}</span>
                  <HealthPill state="checking" />
                </li>
              ))}
            </ul>
          }
        >
          <CardHealth product={product} />
        </Suspense>
      ) : (
        <p className="card__empty">No backend yet</p>
      )}

      <span className="card__more">
        {product.views.length > 0 ? "Live data" : hasServices ? "Health & wiring" : "View plan"} <ArrowIcon />
      </span>
    </Link>
  );
}

export default async function OverviewPage() {
  const session = await requireSession();
  const services = PRODUCTS.flatMap((p) => p.services);
  const connected = services.filter(isServiceConfigured).length;
  const live = PRODUCTS.filter((p) => p.status === "live").length;

  return (
    <>
      <PageHead
        eyebrow="Overview"
        title={
          <>
            {greeting()}, <span className="serif-italic">{session.sub}.</span>
          </>
        }
        lede="Every Parakletus product in one place. Health is checked live against each product's backend."
      >
        <RefreshButton />
      </PageHead>

      <section className="stats" aria-label="Summary">
        <div className="stat stat--ink">
          <span className="stat__label">Products live</span>
          <span className="stat__num">{live}</span>
          <span className="stat__note">of {PRODUCTS.length} in the portfolio</span>
        </div>
        <div className="stat">
          <span className="stat__label">Backends configured</span>
          <span className="stat__num">
            {connected}
            <small>/{services.length}</small>
          </span>
          <span className="stat__note">
            {connected < services.length ? (
              <Link href="/connections" className="stat__link">
                Connect the rest <ArrowIcon size={12} />
              </Link>
            ) : (
              "all wired"
            )}
          </span>
        </div>
        <Suspense fallback={<StatsFallback />}>
          <LiveStats />
        </Suspense>
      </section>

      <section aria-labelledby="products-h">
        <h2 id="products-h" className="block-title">
          Products
        </h2>
        <div className="grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
