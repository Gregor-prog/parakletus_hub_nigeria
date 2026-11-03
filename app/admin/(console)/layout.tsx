import Link from "next/link";
import { requireSession } from "@/lib/admin/dal";
import { PRODUCTS } from "@/lib/admin/products";
import { logout } from "../actions";
import { MobileNav, SideNav, WatClock } from "../_components/client";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const nav = PRODUCTS.map(({ slug, name, code, status }) => ({ slug, name, code, status }));

  return (
    <div className="shell">
      <aside className="side">
        <Link href="/" className="brand side__brand">
          <span className="brand__mark">
            <img src="/favicon.png" alt="" width={32} height={32} />
          </span>
          <span className="brand__word">
            <span className="brand__lockup">PARAKLETUS</span>
            <span className="brand__sub">
              CONSOLE <i className="brand__sub-dot" />
            </span>
          </span>
        </Link>
        <SideNav products={nav} />
        <div className="side__foot">
          <div className="side__user">
            <span className="side__avatar" aria-hidden="true">
              {session.sub.slice(0, 1).toUpperCase()}
            </span>
            <span className="side__user-name">{session.sub}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="side__signout">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="shell__main">
        <header className="topbar">
          <MobileNav products={nav}>
            <form action={logout} className="adm-drawer__foot">
              <span className="side__user-name">{session.sub}</span>
              <button type="submit" className="side__signout">Sign out</button>
            </form>
          </MobileNav>
          <Link href="/" className="topbar__brand">
            <img src="/favicon.png" alt="" width={26} height={26} />
            <span>Console</span>
          </Link>
          <div className="topbar__right">
            <WatClock />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
