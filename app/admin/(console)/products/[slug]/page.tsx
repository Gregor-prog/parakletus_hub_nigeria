import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { requireSession } from "@/lib/admin/dal";
import { getHealth } from "@/lib/admin/health";
import { isServiceConfigured } from "@/lib/admin/backends";
import { getProduct, type Product } from "@/lib/admin/products";
import { RefreshButton } from "../../../_components/client";
import { ExternalIcon, HealthPill, PageHead, StatusTag } from "../../../_components/ui";
import { PANELS } from "../../../_panels";

type Params = { params: Promise<{ slug: string }> };
type Search = { searchParams: Promise<{ tab?: string; page?: string; q?: string; status?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProduct(slug)?.name ?? "Product" };
}

async function ServicesTable({ product }: { product: Product }) {
  const health = (await getHealth()).filter((h) => h.product === product.slug);
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">Status</th>
            <th scope="col">Host</th>
            <th scope="col">Response</th>
            <th scope="col">Checked</th>
          </tr>
        </thead>
        <tbody>
          {product.services.map((s) => {
            const h = health.find((x) => x.service === s.key)!;
            return (
              <tr key={s.key}>
                <th scope="row">{s.label}</th>
                <td>
                  <HealthPill state={h.state} />
                </td>
                <td className="mono">{h.host ?? <span className="muted">—</span>}</td>
                <td className="mono">
                  {h.state === "unconfigured" ? (
                    <span className="muted">—</span>
                  ) : h.error ? (
                    <span className="danger">{h.error}</span>
                  ) : (
                    `HTTP ${h.httpStatus} · ${h.latencyMs} ms`
                  )}
                </td>
                <td className="mono muted">
                  {new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", timeStyle: "medium" }).format(
                    new Date(h.checkedAt),
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PanelLoading({ label }: { label: string }) {
  return <div className="table-wrap table-wrap--loading">Loading {label.toLowerCase()} from the backend…</div>;
}

export default async function ProductPage({ params, searchParams }: Params & Search) {
  await requireSession();
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const sp = await searchParams;
  const panels = PANELS[product.slug];
  const view = product.views.find((v) => v.key === sp.tab);
  const ViewPanel = view ? panels?.views[view.key] : undefined;
  const Overview = panels?.overview;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = sp.q?.trim().slice(0, 100) || undefined;
  const base = `/products/${product.slug}`;
  const status = /^[a-z_]{1,40}$/.test(sp.status ?? "") ? sp.status : undefined;

  const configured = new Set(product.services.filter(isServiceConfigured).map((s) => s.key));

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Overview</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <PageHead
        eyebrow={`${product.code} · ${product.sector}`}
        title={
          <span className="title-with-logo">
            {product.logo && <img src={product.logo} alt="" className="title-logo" />}
            {product.name}
          </span>
        }
        lede={product.tagline}
      >
        <StatusTag status={product.status} />
        {product.publicUrl && (
          <a href={product.publicUrl} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--ghost">
            Open site <ExternalIcon />
          </a>
        )}
        {product.services.length > 0 && <RefreshButton />}
      </PageHead>

      {product.services.length === 0 ? (
        <section className="empty">
          <h2 className="empty__title">Nothing to connect yet</h2>
          <p>
            {product.name} is {product.status === "roadmap" ? "on the roadmap" : "coming soon"} and has no backend. When it does,
            add its services to <code>lib/admin/products.ts</code> and they&apos;ll appear here.
          </p>
        </section>
      ) : (
        <>
          {product.views.length > 0 && (
            <nav className="tabs" aria-label={`${product.name} sections`}>
              <Link href={base} className={`tabs__link ${view ? "" : "is-active"}`} aria-current={view ? undefined : "page"}>
                Overview
              </Link>
              {product.views.map((v) => (
                <Link
                  key={v.key}
                  href={`${base}?tab=${v.key}`}
                  className={`tabs__link ${view?.key === v.key ? "is-active" : ""}`}
                  aria-current={view?.key === v.key ? "page" : undefined}
                >
                  {v.label}
                </Link>
              ))}
            </nav>
          )}

          {view && ViewPanel ? (
            <Suspense key={`${view.key}-${page}-${q ?? ""}-${status ?? ""}`} fallback={<PanelLoading label={view.label} />}>
              <ViewPanel base={base} page={page} q={q} status={status} />
            </Suspense>
          ) : (
            <>
              {Overview && (
                <Suspense fallback={<PanelLoading label="Live numbers" />}>
                  <Overview />
                </Suspense>
              )}

              <section aria-labelledby="svc-h">
                <h2 id="svc-h" className="block-title">
                  Services
                </h2>
                <Suspense
                  fallback={
                    <div className="table-wrap table-wrap--loading">
                      Checking {product.services.length} service{product.services.length > 1 ? "s" : ""}…
                    </div>
                  }
                >
                  <ServicesTable product={product} />
                </Suspense>
              </section>

              {product.modules.length > 0 && (
                <section aria-labelledby="mod-h">
                  <h2 id="mod-h" className="block-title">
                    {product.views.length > 0 ? "Planned" : "Modules"}
                  </h2>
                  <div className="modules">
                    {product.modules.map((m) => {
                      const svc = product.services.find((s) => s.key === m.service);
                      const ready = svc ? configured.has(svc.key) : false;
                      return (
                        <article key={m.key} className={`module ${ready ? "module--ready" : ""}`}>
                          <h3 className="module__name">{m.label}</h3>
                          <p className="module__desc">{m.description}</p>
                          <span className="module__state">
                            {ready ? "Backend configured · endpoint pending" : `Waiting for ${svc?.envPrefix}_API_URL`}
                          </span>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              <section aria-labelledby="wire-h">
                <h2 id="wire-h" className="block-title">
                  Wiring
                </h2>
                <div className="wiring">
                  {product.services.map((s) => (
                    <div key={s.key} className="wiring__row">
                      <div>
                        <p className="wiring__label">{s.label}</p>
                        {s.repo && (
                          <a
                            className="wiring__repo"
                            href={`https://github.com/${s.repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {s.repo} <ExternalIcon size={11} />
                          </a>
                        )}
                      </div>
                      <code className="wiring__env">
                        {s.envPrefix}_API_URL
                        <br />
                        {s.envPrefix}_API_TOKEN <span className="muted"># = the backend&apos;s ADMIN_CONSOLE_TOKEN</span>
                        <br />
                        {s.envPrefix}_HEALTH_PATH <span className="muted"># default {s.healthPath}</span>
                      </code>
                      <span className={`wiring__state ${configured.has(s.key) ? "is-on" : ""}`}>
                        {configured.has(s.key) ? "Configured" : "Not set"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
