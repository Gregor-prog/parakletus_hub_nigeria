import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/admin/products";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const live = PRODUCTS.filter((p) => p.status === "live");

  return (
    <main className="login">
      <section className="login__aside" aria-hidden="true">
        <div className="login__brand">
          <img src="/favicon.png" alt="" width={36} height={36} />
          <div className="brand__word">
            <span className="brand__lockup login__lockup">PARAKLETUS</span>
            <span className="brand__sub login__sub">
              CONSOLE <i className="brand__sub-dot" />
            </span>
          </div>
        </div>

        <h1 className="login__headline">
          Every product,
          <br />
          <span className="serif-italic">one desk.</span>
        </h1>

        <ul className="login__roster">
          {live.map((p) => (
            <li key={p.slug}>
              <span className="login__roster-code">{p.code}</span>
              <span className="login__roster-line" />
              <span className="login__roster-tag">{p.sector}</span>
            </li>
          ))}
        </ul>

        <p className="login__foot">Restricted. Authorised Parakletus staff only.</p>
      </section>

      <section className="login__main">
        <div className="login__card">
          <span className="section-eyebrow">
            <span className="section-eyebrow__dot" /> Admin access
          </span>
          <h2 className="login__title">Sign in</h2>
          <p className="login__lede">Use the console credentials issued to you.</p>
          <LoginForm next={next ?? "/"} />
        </div>
      </section>
    </main>
  );
}
