"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { Product } from "@/lib/admin/products";

/** usePathname may report the rewritten /admin/... path; normalise to the public one. */
function useAdminPath() {
  const raw = usePathname() ?? "/";
  return raw.replace(/^\/admin(?=\/|$)/, "") || "/";
}

export function WatClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="nav__status adm-clock">
      <span className="nav__status-dot" />
      <span className="nav__status-label">PHC LIVE</span>
      <span className="nav__status-sep">/</span>
      <span className="nav__status-time">{time ?? "--:--:--"}</span>
      <span className="nav__status-zone">WAT</span>
    </div>
  );
}

type NavProduct = Pick<Product, "slug" | "name" | "code" | "status">;

export function SideNav({ products, onNavigate }: { products: NavProduct[]; onNavigate?: () => void }) {
  const path = useAdminPath();
  const item = (href: string, label: string, extra?: React.ReactNode) => {
    const active = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
    return (
      <li key={href}>
        <Link href={href} className={`side__link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={onNavigate}>
          <span>{label}</span>
          {extra}
        </Link>
      </li>
    );
  };

  return (
    <nav className="side__nav" aria-label="Console">
      <ul>
        {item("/", "Overview")}
        {item("/connections", "Connections")}
      </ul>
      <p className="side__heading">Products</p>
      <ul>
        {products.map((p) =>
          item(
            `/products/${p.slug}`,
            p.name,
            p.status !== "live" ? <span className="side__soon">{p.status === "roadmap" ? "Roadmap" : "Soon"}</span> : null,
          ),
        )}
      </ul>
    </nav>
  );
}

export function MobileNav({ products, children }: { products: NavProduct[]; children?: React.ReactNode }) {
  // Closes itself via SideNav's onNavigate when a link is followed.
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`adm-burger ${open ? "is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      {open && (
        <div className="adm-drawer">
          <SideNav products={products} onNavigate={() => setOpen(false)} />
          {children}
        </div>
      )}
    </>
  );
}

export function RefreshButton({ label = "Re-check" }: { label?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button type="button" className="adm-btn adm-btn--ghost" disabled={pending} onClick={() => start(() => router.refresh())}>
      <svg className={pending ? "spin" : undefined} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {pending ? "Checking…" : label}
    </button>
  );
}
