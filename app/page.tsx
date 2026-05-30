"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  // ─── State ───────────────────────────────────────────────────────
  const [scrolled, setScrolled]             = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeStr, setTimeStr]               = useState("20:00:00");
  const [activeIdx, setActiveIdx]           = useState(0);
  const [menuOpen, setMenuOpen]             = useState(false);

  // ─── Refs ─────────────────────────────────────────────────────────
  const navRef       = useRef<HTMLDivElement>(null);
  const linkRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const heroSunRef   = useRef<HTMLDivElement>(null);
  const heroGrainRef = useRef<HTMLDivElement>(null);

  const [pillStyle, setPillStyle] = useState({
    transform: "translateX(0px)",
    width: "0px",
    opacity: 0,
  });

  const navLinks = [
    { label: "About Us",     href: "/about"        },
    { label: "Subsidiaries", href: "/subsidiaries" },
  ];

  // ─── Scroll detection + progress ─────────────────────────────────
  useEffect(() => {
    const handle = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress(window.scrollY / total);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // ─── WAT clock ───────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wat = new Date(utc + 3600000);
      const h = String(wat.getHours()).padStart(2, "0");
      const m = String(wat.getMinutes()).padStart(2, "0");
      const s = String(wat.getSeconds()).padStart(2, "0");
      setTimeStr(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Nav pill geometry ────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const activeEl    = linkRefs.current[activeIdx];
      const containerEl = navRef.current;
      if (activeEl && containerEl) {
        const ar = activeEl.getBoundingClientRect();
        const cr = containerEl.getBoundingClientRect();
        setPillStyle({
          transform: `translateX(${ar.left - cr.left}px)`,
          width:     `${ar.width}px`,
          opacity:   1,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    const t = setTimeout(update, 100);
    return () => { window.removeEventListener("resize", update); clearTimeout(t); };
  }, [activeIdx]);

  // ─── Scroll-reveal (IntersectionObserver) ────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ─── Impact counter animation ─────────────────────────────────────
  useEffect(() => {
    const counterEls = document.querySelectorAll<HTMLElement>(
      ".impactrow__k[data-target]"
    );

    const animate = (el: HTMLElement) => {
      const raw    = el.dataset.target!;
      const match  = raw.match(/[\d.]+/);
      if (!match) return;
      const numStr  = match[0];
      const numIdx  = raw.indexOf(numStr);
      const prefix  = raw.slice(0, numIdx);
      const suffix  = raw.slice(numIdx + numStr.length);
      const target  = parseFloat(numStr);
      const decimal = numStr.includes(".");
      const dur     = 1600;
      const t0      = performance.now();

      const tick = (now: number) => {
        const p     = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v     = eased * target;
        el.textContent =
          prefix + (decimal ? v.toFixed(1) : Math.round(v).toString()) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target as HTMLElement);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ─── Parallax: hero sun + grain ──────────────────────────────────
  useEffect(() => {
    let raf: number;
    let lastY  = window.scrollY;
    let ticking = false;

    const apply = () => {
      const y = lastY;
      if (heroSunRef.current)
        heroSunRef.current.style.transform = `translateY(${y * 0.15}px)`;
      if (heroGrainRef.current)
        heroGrainRef.current.style.transform = `translateY(${y * 0.08}px)`;
      ticking = false;
    };

    const onScroll = () => {
      lastY = window.scrollY;
      if (!ticking) { raf = requestAnimationFrame(apply); ticking = true; }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // ─── Active section tracking ──────────────────────────────────────
  useEffect(() => {
    const ids      = ["home", "manifesto", "pillars", "solutions", "impact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id);
            if (idx >= 0) setActiveIdx(idx);
          }
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // ─── Body scroll-lock when overlay is open ────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ─── JSX ──────────────────────────────────────────────────────────
  return (
    <div id="home" style={{ scrollBehavior: "smooth" }}>

      {/* SCROLLBAR TRACKER */}
      <div className="scrollbar">
        <div
          className="scrollbar__fill"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* MOBILE OVERLAY NAV */}
      <div className={`nav__overlay ${menuOpen ? "is-open" : ""}`}>
        <nav className="nav__overlay-links">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className="nav__overlay-link"
              onClick={() => { setActiveIdx(idx); setMenuOpen(false); }}
            >
              {link.label}
              <div className="nav__overlay-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </a>
          ))}
        </nav>
        <div className="nav__overlay-cta-row">
          <a href="#contact" className="btn btn--primary" onClick={() => setMenuOpen(false)}>
            Partner With Us
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline", marginLeft: 4 }}>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* PREMIUM GLASS NAVIGATION RAIL */}
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav__inner">

          {/* Brand */}
          <a href="#home" className="brand">
            <div className="brand__mark">
              <img src="/favicon.png" alt="Parakletus Hub Nigeria" width="36" height="36" style={{ objectFit: "contain", display: "block" }} />
            </div>
            <div className="brand__word">
              <span className="brand__lockup">PARAKLETUS</span>
              <span className="brand__sub">
                HUB NIGERIA <i className="brand__sub-dot" />
              </span>
            </div>
          </a>

          {/* Sliding pill center rail */}
          <nav ref={navRef} className="nav__rail">
            <div
              className="nav__pill"
              style={{
                transform: pillStyle.transform,
                width:     pillStyle.width,
                opacity:   pillStyle.opacity,
              }}
            />
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                ref={(el) => { linkRefs.current[idx] = el; }}
                href={link.href}
                className={`nav__link ${activeIdx === idx ? "is-active" : ""}`}
                onClick={() => { setActiveIdx(idx); setMenuOpen(false); }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="nav__right">
            <div className="nav__status">
              <span className="nav__status-dot" />
              <span className="nav__status-label">LAGOS LIVE</span>
              <span className="nav__status-sep">/</span>
              <span className="nav__status-time">{timeStr}</span>
              <span className="nav__status-zone">WAT</span>
            </div>

            <a href="#contact" className="nav__cta">
              <span className="nav__cta-label">Partner With Us</span>
              <div className="nav__cta-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </a>

            {/* Hamburger (mobile only) */}
            <button
              className={`nav__burger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero__grain" ref={heroGrainRef} />
        <div className="hero__sun"   ref={heroSunRef}   />

        <div className="hero__container">
          <div className="hero__chip">
            <span className="hero__chip-dot" />
            Empowering the Global South
          </div>

          <h1 className="hero__title">
            Building <span className="serif-italic">Education</span> and Technology{" "}
            <span className="hero__title-accent">Infrastructure</span>.
          </h1>

          <div className="hero__row">
            <p className="hero__lede">
              Parakletus Hub Nigeria builds the educational and technological infrastructure the Global South needs to compete, innovate, and lead.
            </p>
            <div className="hero__ctas">
              <a href="#solutions" className="btn btn--primary">
                Explore Our Solutions{" "}
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline", marginLeft: 4 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a href="#manifesto" className="btn btn--ghost">
                Read Our Manifesto
              </a>
            </div>
          </div>

          {/* Stage */}
          <div className="hero__stage">
            <div className="stage">
              <div className="stage__photo">
                <div className="stage__photo-inner">
                  <svg className="stage__svg" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="800" height="450" fill="var(--c-cream)" />
                    <circle cx="650" cy="150" r="280" fill="url(#heroSunGlow)" opacity="0.4" />
                    <line x1="50" y1="50"  x2="750" y2="50"  stroke="var(--c-line)" strokeDasharray="4 4" />
                    <line x1="50" y1="200" x2="750" y2="200" stroke="var(--c-line)" strokeDasharray="4 4" />
                    <line x1="50" y1="350" x2="750" y2="350" stroke="var(--c-line)" strokeDasharray="4 4" />
                    <line x1="200" y1="0" x2="200" y2="450" stroke="var(--c-line)" strokeDasharray="4 4" />
                    <line x1="500" y1="0" x2="500" y2="450" stroke="var(--c-line)" strokeDasharray="4 4" />
                    <path d="M50 380 Q 250 180, 500 280 T 800 120" stroke="var(--c-grove-mid)" strokeWidth="3" opacity="0.35" fill="none" />
                    <path d="M50 400 Q 300 280, 550 320 T 800 180" stroke="var(--c-grove)" strokeWidth="1.5" opacity="0.18" fill="none" />
                    <defs>
                      <radialGradient id="heroSunGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(650 150) rotate(90) scale(280)">
                        <stop stopColor="var(--c-grove-soft)" />
                        <stop offset="1" stopColor="var(--c-cream)" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                  <div className="stage__photo-tag">HUB LIVE LABS</div>
                </div>
              </div>

              {/* Floating Card 1 — top left */}
              <div className="stage__card stage__card--tl">
                <div className="stage__card-row">
                  <div className="stage__card-icon" style={{ background: "rgba(28,94,60,0.1)", color: "var(--c-grove)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12.5V16a6 6 0 0012 0v-3.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="stage__card-name">ParaLearn</div>
                    <div className="stage__card-meta">Educational Infrastructure software</div>
                  </div>
                </div>
                <div className="stage__card-bar"><span style={{ width: "78%" }} /></div>
                <div className="stage__card-foot">Active Operations: <b>78% Efficiency</b></div>
              </div>

              {/* Floating Card 2 — center */}
              <div className="stage__card stage__card--ml">
                <div className="stage__card-row">
                  <div className="stage__card-icon" style={{ background: "rgba(31,138,91,0.1)", color: "var(--c-green)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                  </div>
                  <div>
                    <div className="stage__card-name">Explore EdTech</div>
                    <div className="stage__card-meta">International Expo</div>
                  </div>
                </div>
                <div className="stage__card-amount">2,800+ <span>ATTENDEES</span></div>
              </div>

              {/* Floating Card 3 — bottom right */}
              <div className="stage__card stage__card--br">
                <div className="stage__card-row">
                  <div className="stage__card-icon" style={{ background: "rgba(238,124,36,0.12)", color: "var(--c-ember-deep)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="stage__card-name">Ayọ̀lọ̀ Ledger</div>
                    <div className="stage__card-meta">Stablecoin Rail</div>
                  </div>
                </div>
                <div className="stage__card-bar">
                  <span style={{ width: "94%", background: "linear-gradient(90deg,var(--c-grove),var(--c-ember))" }} />
                </div>
                <div className="stage__card-foot">Cross-Border Settlement: <b>94% speedup</b></div>
              </div>
            </div>
          </div>

          {/* Ticker strip */}
          <div className="hero__strip">
            <span className="hero__strip-label">CORE FOCUS AREAS</span>
            <ul className="hero__strip-list">
              <li>School Management</li>
              <li>Stablecoin Rails</li>
              <li>Educational Publishing</li>
              <li>Professional Skill Bootcamps</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="manifesto" className="manifesto">
        <div className="manifesto__inner reveal">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Our Creed
          </div>
          <blockquote className="manifesto__copy">
            We believe that the <span className="serif-italic">Global South</span> must not merely
            consume the technological future, but actively <span className="serif-italic">architect</span> it.
          </blockquote>
          <div className="manifesto__signoff">
            PARAKLETUS HUB NIGERIA — BOARD OF TRUSTEES
          </div>
        </div>
      </section>

      {/* ECOSYSTEM PILLARS */}
      <section id="pillars" className="pillars">
        <div className="pillars__head reveal">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            The Framework
          </div>
          <h2 className="section-title">An Integrated Ecosystem</h2>
          <p className="section-lede">
            By connecting engineering, training, and literature, we build a self-sustaining ecosystem where knowledge shapes technology, and technology accelerates dissemination.
          </p>
        </div>

        <div className="pillars__grid">
          <div className="pillar pillar--tech reveal" data-delay="1">
            <span className="pillar__num">01</span>
            <span className="pillar__kicker">INFRASTRUCTURE</span>
            <h3 className="pillar__title">Parakletus Technologies</h3>
            <p className="pillar__lede">
              We design and deploy cloud networks, school management platforms, and blockchain tools calibrated for African operational constraints.
            </p>
            <div className="pillar__surface">
              <span className="pillar__surface-label">ENGINEERING STANDARD</span>
              <p>Scalable APIs, Rust/Go microservices, and AI-enabled diagnostics.</p>
            </div>
            <a href="#solutions" className="pillar__link">Explore Tech Solutions</a>
            <div className="pillar__etch">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <rect x="10" y="10" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>

          <div className="pillar pillar--pub reveal" data-delay="2">
            <span className="pillar__num">02</span>
            <span className="pillar__kicker">LITERATURE</span>
            <h3 className="pillar__title">Parakletus Publishing</h3>
            <p className="pillar__lede">
              We edit, design, and publish peer-reviewed textbooks, professional journals, and cultural literature aligned to African curricula and voices.
            </p>
            <div className="pillar__surface">
              <span className="pillar__surface-label">EDITORIAL REACH</span>
              <p>Textbooks aligned with national curricula, digital-first distribution.</p>
            </div>
            <a href="#solutions" className="pillar__link">Explore Catalogues</a>
            <div className="pillar__etch">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <line x1="20" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="20" y1="70" x2="60" y2="70" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS BENTO */}
      <section id="solutions" className="solutions">
        <div className="solutions__head reveal">
          <h2 className="section-title">Spotlight Solutions</h2>
          <p className="section-lede">
            Built for African realities: low bandwidth, variable power, high-demand institutions.
          </p>
        </div>

        <div className="solutions__bento">
          <div className="sol sol--lg sol--ember reveal" data-delay="1">
            <div className="sol__head">
              <div className="sol__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12.5V16a6 6 0 0012 0v-3.5" />
                </svg>
              </div>
              <span className="sol__tag">FLAGSHIP SOFTWARE</span>
            </div>
            <h3 className="sol__name">ParaLearn Platform</h3>
            <p className="sol__desc">
              School and learning management built for low-bandwidth classrooms. Grade books, timetables,
              fee management, and offline learning modules — in one platform.
            </p>
            <ul className="sol__chips" style={{ marginTop: 16 }}>
              <li>Offline Synchronous Sync</li>
              <li>SMS Notification API</li>
              <li>Automated Grading Engine</li>
            </ul>
            <div className="sol__foot">
              <a href="#contact" className="sol__more">Request Institutional Demo →</a>
            </div>
          </div>

          <div className="sol sol--md sol--ink reveal" data-delay="2">
            <div className="sol__head">
              <div className="sol__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <span className="sol__tag">ON-CHAIN FINANCE</span>
            </div>
            <h3 className="sol__name">Ayọ̀lọ̀ Settlement Rail</h3>
            <p className="sol__desc">
              Stablecoin-powered payment rails enabling secure, compliant, near-zero-fee remittance and settlements for developers and businesses across West Africa.
            </p>
            <div className="sol__foot" style={{ marginTop: "auto" }}>
              <a href="#contact" className="sol__more">Read Technical Spec →</a>
            </div>
          </div>

          <div className="sol sol--md sol--cream reveal" data-delay="3">
            <div className="sol__head">
              <div className="sol__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span className="sol__tag">DIGITAL LITERACY</span>
            </div>
            <h3 className="sol__name">SabiNote</h3>
            <p className="sol__desc">
              Lecture notes, peer-reviewed summaries, and study guides — built collaboratively by students.
            </p>
            <div className="sol__foot" style={{ marginTop: "auto" }}>
              <a href="#contact" className="sol__more">Browse SabiNote Hub →</a>
            </div>
          </div>

          <div className="sol sol--flag reveal" data-delay="4">
            <div className="sol-flag__pulse">
              <span /><span /><span />
            </div>
            <div className="sol-flag__num">24/7</div>
            <div className="sol-flag__label">CORE SYSTEM OPERATIONS ONLINE</div>
            <div className="sol-flag__copy">
              <p>Our distributed microservices guarantee 99.98% uptime for primary school pipelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ZEBRA — technological sovereignty */}
      <section className="zebra">
        <div className="zebra__stripes">
          <span /><span /><span /><span />
        </div>

        <div className="zebra__inner">
          <div className="zebra__head reveal">
            <div className="section-eyebrow section-eyebrow--light">
              <span className="section-eyebrow__dot" />
              Structural Alignment
            </div>
            <h2 className="zebra__title" style={{ color: "#FFFDF7" }}>
              Fostering <span className="serif-italic">Technological</span> Sovereignty.
            </h2>
          </div>

          <div className="zebra__body">
            <p className="zebra__copy reveal" data-delay="1">
              We build tools that respect African realities — high mobile usage, expensive metered data, and intermittent power grids. We don't copy Silicon Valley templates; we construct native infrastructure.
            </p>

            <ul className="zebra__pillars reveal" data-delay="2">
              <li>
                <span className="zebra__k">Locally Hosted Nodes</span>
                <span className="zebra__v">In-school edge servers for fast, always-on platform access.</span>
              </li>
              <li>
                <span className="zebra__k">Stable Ledger Compliant</span>
                <span className="zebra__v">Fully compliant with local digital asset regulations.</span>
              </li>
            </ul>
          </div>

          <div className="zebra__quote reveal" data-delay="1">
            <div className="zebra__quote-mark">"</div>
            <div>
              <p>
                By building operating software for schools and settlement rails for engineers, we lay the groundwork for sustainable development that starts from within.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSIDIARY BRANDS */}
      <section className="brands">
        <div className="brands__head reveal" style={{ maxWidth: 1180, margin: "0 auto 48px" }}>
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Our Operations
          </div>
          <h2 className="section-title">The Subsidiary Grid</h2>
        </div>

        <div className="brands__grid">
          <div className="brandcard reveal" data-delay="1">
            <div className="brandcard__top">
              <span className="brandcard__code">PARALEARN</span>
              <span className="brandcard__idx">01 // EDU</span>
            </div>
            <h3 className="brandcard__name">ParaLearn Academy</h3>
            <p className="brandcard__desc">Technical competence through focused software bootcamps and executive digital training programs.</p>
          </div>

          <div className="brandcard reveal" data-delay="2">
            <div className="brandcard__top">
              <span className="brandcard__code">AYỌ̀LỌ̀</span>
              <span className="brandcard__idx">02 // TECH</span>
            </div>
            <h3 className="brandcard__name">Ayọ̀lọ̀ Systems</h3>
            <p className="brandcard__desc">Distributed ledger gateways and stablecoin infrastructure powering compliant business transactions across West Africa.</p>
          </div>

          <div className="brandcard reveal" data-delay="3">
            <div className="brandcard__top">
              <span className="brandcard__code">PUBLISHING</span>
              <span className="brandcard__idx">03 // PUB</span>
            </div>
            <h3 className="brandcard__name">Parakletus Publishing</h3>
            <p className="brandcard__desc">High-quality textbooks, study aids, and peer-reviewed literature designed for Nigerian students and institutions.</p>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="impact">
        <div className="impact__head reveal">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Empirical Results
          </div>
          <h2 className="section-title">Metrics of Reach</h2>
        </div>

        <div className="impact__grid">
          <div className="impactrow reveal" data-delay="1">
            <div className="impactrow__k" data-target="24k">24k</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Students Enrolled</div>
              <div className="impactrow__note">Active daily across our LMS platform.</div>
            </div>
          </div>
          <div className="impactrow reveal" data-delay="2">
            <div className="impactrow__k" data-target="₦8.5B">₦8.5B</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Settled Value</div>
              <div className="impactrow__note">Processed across our stablecoin rails.</div>
            </div>
          </div>
          <div className="impactrow reveal" data-delay="3">
            <div className="impactrow__k" data-target="140+">140+</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Institutions</div>
              <div className="impactrow__note">Primary and secondary schools integrated.</div>
            </div>
          </div>
          <div className="impactrow reveal" data-delay="4">
            <div className="impactrow__k" data-target="18k">18k</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Textbooks</div>
              <div className="impactrow__note">Printed and distributed across Nigerian schools.</div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL CTA */}
      <section id="contact" className="cta">
        <div className="cta__sun" />
        <div className="cta__inner">
          <div className="section-eyebrow section-eyebrow--light reveal">
            <span className="section-eyebrow__dot" />
            Next Step
          </div>
          <h2 className="cta__title reveal" data-delay="1">
            Partner With <span className="serif-italic">Parakletus</span> today.
          </h2>
          <p className="cta__lede reveal" data-delay="2">
            Whether you're a school director integrating ParaLearn, a business running on stablecoin rails, or an academic writer seeking publication — our Lagos desk is ready.
          </p>

          <div className="cta__lanes">
            <div className="lane reveal" data-delay="1">
              <span className="lane__kicker">SCHOOL OPERATION</span>
              <h3 className="lane__title">Integrate ParaLearn</h3>
              <p className="lane__meta">Request custom software onboarding &amp; edge node deployment.</p>
            </div>
            <div className="lane reveal" data-delay="2">
              <span className="lane__kicker">FINANCIAL BILLING</span>
              <h3 className="lane__title">Utilize Ayọ̀lọ̀ Rails</h3>
              <p className="lane__meta">Apply for API keys to support stablecoin settlements.</p>
            </div>
            <div className="lane reveal" data-delay="3">
              <span className="lane__kicker">ACADEMIC PRESS</span>
              <h3 className="lane__title">Submit Manuscripts</h3>
              <p className="lane__meta">Get rigorous textbook publication services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__lockup">
              <img src="/favicon.png" alt="Parakletus Hub Nigeria" width="24" height="24" style={{ objectFit: "contain", display: "block" }} />
              <span className="footer__name">PARAKLETUS HUB NIGERIA</span>
            </div>
            <p className="footer__caption">
              Rigorous technology and educational systems built for African institutional realities.
            </p>
            <div className="footer__cac">RC NUMBER: 1845920</div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__h">Solutions</div>
              <ul>
                <li><a href="#solutions">ParaLearn</a></li>
                <li><a href="#solutions">Ayọ̀lọ̀ Payments</a></li>
                <li><a href="#solutions">SabiNote Pubs</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Framework</div>
              <ul>
                <li><a href="#pillars">Technology</a></li>
                <li><a href="#pillars">Publishing</a></li>
                <li><a href="#pillars">Education</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Directors</div>
              <ul>
                <li><a href="#team">Leadership</a></li>
                <li><a href="#team">Advisory Board</a></li>
                <li><a href="#team">CAC Status</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Desk</div>
              <ul>
                <li>Lagos, Nigeria</li>
                <li><a href="mailto:onboarding@parakletushub.ng" style={{ textDecoration: "underline" }}>Email Desk</a></li>
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
