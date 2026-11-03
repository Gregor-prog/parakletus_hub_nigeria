import type { ServiceHealth } from "@/lib/admin/backends";
import { STATUS_LABEL, type ProductStatus } from "@/lib/admin/products";

const HEALTH_LABEL: Record<ServiceHealth["state"] | "checking", string> = {
  online: "Online",
  degraded: "Degraded",
  offline: "Offline",
  unconfigured: "Not connected",
  checking: "Checking",
};

export function HealthPill({ state, detail }: { state: ServiceHealth["state"] | "checking"; detail?: string }) {
  return (
    <span className={`pill pill--${state}`} title={detail}>
      <i className="pill__dot" aria-hidden="true" />
      {HEALTH_LABEL[state]}
    </span>
  );
}

export function StatusTag({ status }: { status: ProductStatus }) {
  return <span className={`tag tag--${status}`}>{STATUS_LABEL[status]}</span>;
}

export function healthDetail(h: ServiceHealth): string | undefined {
  if (h.state === "unconfigured") return undefined;
  if (h.error) return `${h.host} · ${h.error}`;
  return `${h.host} · HTTP ${h.httpStatus} · ${h.latencyMs} ms`;
}

export function PageHead({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <span className="section-eyebrow">
          <span className="section-eyebrow__dot" /> {eyebrow}
        </span>
        <h1 className="page-head__title">{title}</h1>
        {lede && <p className="page-head__lede">{lede}</p>}
      </div>
      {children && <div className="page-head__actions">{children}</div>}
    </header>
  );
}

export function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
