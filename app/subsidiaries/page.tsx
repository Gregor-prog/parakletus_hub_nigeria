"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const subsidiaries = [
  {
    code:    "IJSDS",
    idx:     "01 // JOURNAL",
    name:    "IJSDS",
    tagline: "International Journal of Social Work and Development Studies",
    desc:    "A peer-reviewed academic journal publishing original research in social work practice, community development, policy analysis, and developmental studies — indexed and freely accessible.",
    href:    "https://ijsds.org",
    tag:     "LIVE",
    sector:  "PUBLISHING",
  },
  {
    code:    "PARALEARN",
    idx:     "02 // EDTECH",
    name:    "ParaLearn",
    tagline: "Modern Result Management for African Schools",
    desc:    "Result management software that moves schools from paperwork to a unified digital system — real-time master broadsheets, bulk onboarding, attendance, secure computer-based testing with anti-malpractice safeguards, offline score entry, and instant report cards across an admin portal and mobile app.",
    href:    "https://pln.ng",
    tag:     "LIVE",
    sector:  "TECHNOLOGY",
  },
  {
    code:    "SABINOTE",
    idx:     "03 // EDTECH",
    name:    "SabiNote",
    tagline: "AI-Powered Lesson Note Generation",
    desc:    "AI lesson-planning tool for Nigerian educators. Generates NERDC-compliant, classroom-ready lesson notes from each state's official scheme of work — with rich-text editing, difficulty tiers, and one-click PDF/DOCX export.",
    href:    "https://sabinote.pln.ng",
    tag:     "LIVE",
    sector:  "TECHNOLOGY",
  },
  {
    code:    "AYỌ̀LỌ̀",
    idx:     "04 // ROADMAP",
    name:    "Ayọ̀lọ̀ Systems",
    tagline: "Stablecoin Cross-Border Payment Rails",
    desc:    "Stablecoin rails for cross-border payments and remittances — low-fee settlement infrastructure connecting Africa to the world (currently on the roadmap).",
    href:    null,
    tag:     "PLANNED ROADMAP",
    sector:  "TECHNOLOGY",
  },
  {
    code:    "PUBLISHING",
    idx:     "05 // PUB",
    name:    "Parakletus Publishing",
    tagline: "Academic Publishing",
    desc:    "Our academic publishing division giving young writers access to affordable, reliable publishing services — ghostwriting, copy editing, developmental editing, book cover design, proofreading, report writing, and Statement of Purpose (SOP) writing.",
    href:    null,
    tag:     "COMING SOON",
    sector:  "PUBLISHING",
  },
  {
    code:    "ACADEMY",
    idx:     "06 // EDU",
    name:    "ParaLearn Academy",
    tagline: "K-12 Digital Skill Training",
    desc:    "Our digital skill acquisition academy training K-12 students in software development, product design, smartphone graphics design and video editing, Google Suite for K-12, and more.",
    href:    null,
    tag:     "COMING SOON",
    sector:  "EDUCATION",
  },
  {
    code:    "GSI",
    idx:     "07 // TECH",
    name:    "GSI Buildathon",
    tagline: "Global South Index Initiative",
    desc:    "Our annual remote sprint and collaborative engineering ecosystem, bringing together African builders to design and run research tools for the Global South.",
    href:    "https://gsi.parakletushub.com",
    tag:     "LIVE",
    sector:  "TECHNOLOGY",
  },
];

const sectorColor: Record<string, string> = {
  PUBLISHING:  "rgba(28,94,60,0.1)",
  TECHNOLOGY:  "rgba(238,124,36,0.1)",
  EDUCATION:   "rgba(43,122,82,0.12)",
};
const sectorText: Record<string, string> = {
  PUBLISHING:  "var(--c-grove)",
  TECHNOLOGY:  "var(--c-ember-deep)",
  EDUCATION:   "var(--c-grove-mid)",
};

export default function SubsidiariesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [timeStr, setTimeStr]   = useState("00:00:00");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "About Us",      href: "/about"         },
    { label: "Subsidiaries",  href: "/subsidiaries"  },
  ];

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wat = new Date(utc + 3600000);
      setTimeStr(`${String(wat.getHours()).padStart(2,"0")}:${String(wat.getMinutes()).padStart(2,"0")}:${String(wat.getSeconds()).padStart(2,"0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("reveal--visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div>

      {/* MOBILE OVERLAY */}
      <div className={`nav__overlay ${menuOpen ? "is-open" : ""}`}>
        <nav className="nav__overlay-links">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="nav__overlay-link" onClick={() => setMenuOpen(false)}>
              {link.label}
              <div className="nav__overlay-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </nav>
        <div className="nav__overlay-cta-row">
          <Link href="/#contact" className="btn btn--primary" onClick={() => setMenuOpen(false)}>
            Partner With Us
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline", marginLeft: 4 }}><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </Link>
        </div>
      </div>

      {/* NAV */}
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav__inner">
          <Link href="/" className="brand">
            <div className="brand__mark">
              <img src="/favicon.png" alt="Parakletus Hub Nigeria" width="36" height="36" style={{ objectFit: "contain", display: "block" }} />
            </div>
            <div className="brand__word">
              <span className="brand__lockup">PARAKLETUS</span>
              <span className="brand__sub">HUB NIGERIA <i className="brand__sub-dot" /></span>
            </div>
          </Link>

          <nav className="nav__rail">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`nav__link ${link.href === "/subsidiaries" ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__right">
            <div className="nav__status">
              <span className="nav__status-dot" />
              <span className="nav__status-label">PHC LIVE</span>
              <span className="nav__status-sep">/</span>
              <span className="nav__status-time">{timeStr}</span>
              <span className="nav__status-zone">WAT</span>
            </div>
            <Link href="/#contact" className="nav__cta">
              <span className="nav__cta-label">Partner With Us</span>
              <div className="nav__cta-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
            <button
              className={`nav__burger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="subs-hero">
        <div className="subs-hero__inner">
          <div className="section-eyebrow reveal">
            <span className="section-eyebrow__dot" />
            Our Ecosystem
          </div>
          <h1 className="subs-hero__title reveal" data-delay="1">
            The <span className="serif-italic">Subsidiaries</span>
          </h1>
          <p className="subs-hero__lede reveal" data-delay="2">
            Seven operating units. One mandate: build the infrastructure the Global South needs to
            educate, transact, and publish on its own terms.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="subs-grid-section">
        <div className="subs-grid">
          {subsidiaries.map((s, i) => {
            const card = (
              <div className={`subs-card ${s.href ? "subs-card--live" : "subs-card--soon"} reveal`} data-delay={String((i % 3) + 1)}>
                <div className="subs-card__top">
                  <div className="subs-card__codes">
                    <span className="subs-card__code">{s.code}</span>
                    <span className="subs-card__idx">{s.idx}</span>
                  </div>
                  <span
                    className="subs-card__tag"
                    style={{
                      background: s.href ? "rgba(28,94,60,0.1)" : "rgba(100,100,100,0.08)",
                      color:      s.href ? "var(--c-grove)"     : "var(--c-muted)",
                    }}
                  >
                    {s.tag}
                  </span>
                </div>

                <div className="subs-card__body">
                  <span
                    className="subs-card__sector"
                    style={{ background: sectorColor[s.sector], color: sectorText[s.sector] }}
                  >
                    {s.sector}
                  </span>
                  <h2 className="subs-card__name">{s.name}</h2>
                  <p className="subs-card__tagline">{s.tagline}</p>
                  <p className="subs-card__desc">{s.desc}</p>
                </div>

                <div className="subs-card__foot">
                  {s.href ? (
                    <span className="subs-card__link">
                      Visit {s.href.replace("https://", "")}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </span>
                  ) : (
                    <span className="subs-card__soon-label">In development</span>
                  )}
                </div>
              </div>
            );

            return s.href ? (
              <a key={s.code} href={s.href} target="_blank" rel="noopener noreferrer" className="subs-card__wrap">
                {card}
              </a>
            ) : (
              <div key={s.code} className="subs-card__wrap">{card}</div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__lockup">
              <img src="/favicon.png" alt="Parakletus Hub Nigeria" width="36" height="36" style={{ objectFit: "contain", display: "block" }} />
            </div>
            <p className="footer__caption">Rigorous technology and educational systems built for African institutional realities.</p>
            <div className="footer__cac">CAC BN: 1909664</div>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__h">Subsidiaries</div>
              <ul>
                <li><a href="https://ijsds.org" target="_blank" rel="noopener noreferrer">IJSDS</a></li>
                <li><a href="https://pln.ng" target="_blank" rel="noopener noreferrer">ParaLearn</a></li>
                <li><a href="https://sabinote.pln.ng" target="_blank" rel="noopener noreferrer">SabiNote</a></li>
                <li><a href="https://gsi.parakletushub.com" target="_blank" rel="noopener noreferrer">GSI Buildathon</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Company</div>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/subsidiaries">Subsidiaries</Link></li>
                <li><Link href="/#contact">Partner With Us</Link></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Desk</div>
              <ul>
                <li>Port Harcourt, Nigeria</li>
                <li><a href="tel:+2348148876125">Call/WhatsApp: 0814 887 6125</a></li>
                <li><a href="mailto:parakletus70@gmail.com" style={{ textDecoration: "underline" }}>parakletus70@gmail.com</a></li>
                <li>
                  <a href="https://t.me/parakletus_ng" target="_blank" rel="noopener noreferrer">Telegram</a>{" · "}
                  <a href="https://www.facebook.com/dparakletus" target="_blank" rel="noopener noreferrer">Facebook</a>{" · "}
                  <a href="https://www.twitter.com/parakletus_ng" target="_blank" rel="noopener noreferrer">Twitter</a>{" · "}
                  <a href="https://www.instagram.com/parakletus_ng" target="_blank" rel="noopener noreferrer">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} PARAKLETUS HUB NIGERIA. ALL RIGHTS RESERVED.</span>
          <span>CREATING HORIZONS IN THE GLOBAL SOUTH</span>
        </div>
      </footer>

    </div>
  );
}
