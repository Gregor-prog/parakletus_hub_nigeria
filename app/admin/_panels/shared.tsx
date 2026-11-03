import Link from "next/link";
import type { ConsoleResult } from "@/lib/admin/console-api";

const NUM = new Intl.NumberFormat("en-NG");
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric" });
const DATETIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const fmt = (n: number) => NUM.format(n);
export const fmtDate = (iso: string) => DATE.format(new Date(iso));
export const fmtDateTime = (iso: string) => DATETIME.format(new Date(iso));

export type Tile = { label: string; value: number | string; note?: React.ReactNode; tone?: "ink" | "alert" };

export function Tiles({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="stats">
      {tiles.map((t) => (
        <div key={t.label} className={`stat ${t.tone ? `stat--${t.tone}` : ""}`}>
          <span className="stat__label">{t.label}</span>
          <span className="stat__num">{typeof t.value === "number" ? fmt(t.value) : t.value}</span>
          {t.note && <span className="stat__note">{t.note}</span>}
        </div>
      ))}
    </div>
  );
}

export function PanelError({ result, what }: { result: Extract<ConsoleResult<unknown>, { ok: false }>; what: string }) {
  const setup = result.reason === "unconfigured" || result.reason === "no-token" || result.reason === "disabled";
  return (
    <div className={`notice ${setup ? "" : "notice--bad"}`} role={setup ? undefined : "alert"}>
      <p className="notice__title">{setup ? "Not connected yet" : `Couldn't load ${what}`}</p>
      <p className="notice__body">{result.message}</p>
    </div>
  );
}

export function Updated({ iso }: { iso: string }) {
  return <p className="updated">Live from the backend · {fmtDateTime(iso)} WAT</p>;
}

type Query = Record<string, string | undefined>;
function href(base: string, q: Query) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `${base}?${s}` : base;
}

export function SearchBox({ base, tab, q, placeholder }: { base: string; tab: string; q?: string; placeholder: string }) {
  return (
    <form action={base} method="get" className="search" role="search">
      <input type="hidden" name="tab" value={tab} />
      <input
        className="field__input search__input"
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button type="submit" className="adm-btn adm-btn--ghost">
        Search
      </button>
      {q && (
        <Link href={href(base, { tab })} className="search__clear">
          Clear
        </Link>
      )}
    </form>
  );
}

export function Pager({
  base,
  tab,
  q,
  page,
  totalPages,
  total,
  noun,
}: {
  base: string;
  tab: string;
  q?: string;
  page: number;
  totalPages: number;
  total: number;
  noun: string;
}) {
  return (
    <nav className="pager" aria-label="Pages">
      <span className="pager__count">
        {fmt(total)} {noun}
        {total === 1 ? "" : "s"}
        {totalPages > 1 && ` · page ${page} of ${totalPages}`}
      </span>
      {totalPages > 1 && (
        <span className="pager__links">
          {page > 1 ? (
            <Link className="adm-btn adm-btn--ghost" href={href(base, { tab, q, page: String(page - 1) })}>
              ← Previous
            </Link>
          ) : (
            <span className="adm-btn adm-btn--ghost is-disabled">← Previous</span>
          )}
          {page < totalPages ? (
            <Link className="adm-btn adm-btn--ghost" href={href(base, { tab, q, page: String(page + 1) })}>
              Next →
            </Link>
          ) : (
            <span className="adm-btn adm-btn--ghost is-disabled">Next →</span>
          )}
        </span>
      )}
    </nav>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="table-empty">{children}</p>;
}
