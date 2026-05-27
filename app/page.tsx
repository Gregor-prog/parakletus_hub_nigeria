"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  // --- Client-Side States ---
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeStr, setTimeStr] = useState("20:00:00");
  const [activeIdx, setActiveIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Dynamic Navigation Pill State ---
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({
    transform: "translateX(0px)",
    width: "0px",
    opacity: 0,
  });

  // Navigation Links definition
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Pillars", href: "#pillars" },
    { label: "Solutions", href: "#solutions" },
    { label: "Impact", href: "#impact" },
    { label: "Team", href: "#team" },
  ];

  // --- Scroll Detection & Progress Bar ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- West Africa Time (WAT) Clock (Nigeria) ---
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Nigeria is at UTC+1 (WAT)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wat = new Date(utc + 3600000);
      const hrs = String(wat.getHours()).padStart(2, "0");
      const mins = String(wat.getMinutes()).padStart(2, "0");
      const secs = String(wat.getSeconds()).padStart(2, "0");
      setTimeStr(`${hrs}:${mins}:${secs}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Dynamic Sliding Pill Calculation ---
  useEffect(() => {
    const updatePill = () => {
      const activeEl = linkRefs.current[activeIdx];
      const containerEl = navRef.current;
      if (activeEl && containerEl) {
        const activeRect = activeEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        const left = activeRect.left - containerRect.left;
        const width = activeRect.width;
        setPillStyle({
          transform: `translateX(${left}px)`,
          width: `${width}px`,
          opacity: 1,
        });
      }
    };
    updatePill();
    // Re-calculate on resize
    window.addEventListener("resize", updatePill);
    // Short delay to ensure browser layout is ready
    const timer = setTimeout(updatePill, 100);
    return () => {
      window.removeEventListener("resize", updatePill);
      clearTimeout(timer);
    };
  }, [activeIdx]);

  return (
    <div id="home" style={{ scrollBehavior: "smooth" }}>
      {/* ─── SCROLLBAR TRACKER ─── */}
      <div className="scrollbar">
        <div
          className="scrollbar__fill"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* ─── PREMIUM GLASS NAVIGATION RAIL ─── */}
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav__inner">
          {/* Brand Lockup */}
          <a href="#home" className="brand">
            <div className="brand__mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  fill="var(--c-ember)"
                />
                <path
                  d="M2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="var(--c-ember-deep)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="brand__word">
              <span className="brand__lockup">PARAKLETUS</span>
              <span className="brand__sub">
                HUB NIGERIA <i className="brand__sub-dot" />
              </span>
            </div>
          </a>

          {/* Sliding Pill Center Menu */}
          <nav ref={navRef} className="nav__rail">
            <div
              className="nav__pill"
              style={{
                transform: pillStyle.transform,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
              }}
            />
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                ref={(el) => {
                  linkRefs.current[idx] = el;
                }}
                href={link.href}
                className={`nav__link ${activeIdx === idx ? "is-active" : ""}`}
                onClick={() => {
                  setActiveIdx(idx);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Cluster: Live Status & CTA */}
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
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="hero">
        <div className="hero__grain" />
        <div className="hero__sun" />
        
        <div className="hero__container">
          <div className="hero__chip">
            <span className="hero__chip-dot" />
            Empowering the Global South
          </div>

          <h1 className="hero__title">
            Architecting <span className="serif-italic">Educational</span> and Technological{" "}
            <span className="hero__title-accent">Infrastructure</span>.
          </h1>

          <div className="hero__row">
            <p className="hero__lede">
              Parakletus Hub Nigeria designs, develops, and delivers the essential platforms
              the Global South needs to innovate, collaborate, and compete on the world stage.
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

          {/* Interactive Floating Stage */}
          <div className="hero__stage">
            <div className="stage">
              {/* Backing Abstract Editorial Grid/Sun */}
              <div className="stage__photo">
                <div className="stage__photo-inner">
                  <svg className="stage__svg" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="800" height="450" fill="#FFFDF7" />
                    <circle cx="650" cy="150" r="280" fill="url(#heroSunGlow)" opacity="0.4" />
                    <line x1="50" y1="50" x2="750" y2="50" stroke="#E8DFCB" strokeDasharray="4 4" />
                    <line x1="50" y1="200" x2="750" y2="200" stroke="#E8DFCB" strokeDasharray="4 4" />
                    <line x1="50" y1="350" x2="750" y2="350" stroke="#E8DFCB" strokeDasharray="4 4" />
                    <line x1="200" y1="0" x2="200" y2="450" stroke="#E8DFCB" strokeDasharray="4 4" />
                    <line x1="500" y1="0" x2="500" y2="450" stroke="#E8DFCB" strokeDasharray="4 4" />
                    <path d="M50 380 Q 250 180, 500 280 T 800 120" stroke="var(--c-ember)" strokeWidth="3" opacity="0.3" fill="none" />
                    <path d="M50 400 Q 300 280, 550 320 T 800 180" stroke="var(--c-ember-deep)" strokeWidth="1.5" opacity="0.15" fill="none" />
                    
                    <defs>
                      <radialGradient id="heroSunGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(650 150) rotate(90) scale(280)">
                        <stop stopColor="var(--c-ember-soft)" />
                        <stop offset="1" stopColor="var(--c-cream)" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                  <div className="stage__photo-tag">HUB LIVE LABS</div>
                </div>
              </div>

              {/* Floating Card 1: Top Left - LMS Portal */}
              <div className="stage__card stage__card--tl">
                <div className="stage__card-row">
                  <div className="stage__card-icon" style={{ background: "rgba(238, 124, 36, 0.1)", color: "var(--c-ember-deep)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12.5V16a6 6 0 0012 0v-3.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="stage__card-name">ParaLearn LMS</div>
                    <div className="stage__card-meta">AI school software</div>
                  </div>
                </div>
                <div className="stage__card-bar">
                  <span style={{ width: "78%" }} />
                </div>
                <div className="stage__card-foot">
                  Active Operations: <b>78% Efficiency</b>
                </div>
              </div>

              {/* Floating Card 2: Center - Network Nodes */}
              <div className="stage__card stage__card--ml">
                <div className="stage__card-row">
                  <div className="stage__card-icon" style={{ background: "rgba(31, 138, 91, 0.1)", color: "var(--c-green)" }}>
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
                <div className="stage__card-amount">
                  2,800+ <span>ATTENDEES</span>
                </div>
              </div>

              {/* Floating Card 3: Bottom Right - Ayọ̀lọ̀ Remittances */}
              <div className="stage__card stage__card--br">
                <div className="stage__card-row">
                  <div className="stage__card-icon" style={{ background: "rgba(122, 90, 224, 0.1)", color: "var(--c-ember)" }}>
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
                  <span style={{ width: "94%", background: "linear-gradient(90deg, var(--c-green), #7A5AE0)" }} />
                </div>
                <div className="stage__card-foot">
                  Cross-Border Settlement: <b>94% speedup</b>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker Strip */}
          <div className="hero__strip">
            <span className="hero__strip-label">CORE FOCUS AREAS</span>
            <ul className="hero__strip-list">
              <li>School Management (LMS)</li>
              <li>Stablecoin Rails</li>
              <li>Educational Publishing</li>
              <li>Professional Skill Bootcamps</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── MANIFESTO SECTION ─── */}
      <section id="manifesto" className="manifesto">
        <div className="manifesto__inner">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Our Creed
          </div>
          <blockquote className="manifesto__copy">
            We believe that the <span className="serif-italic">Global South</span> must not merely consume the technological future, but actively <span className="serif-italic">architect</span> it.
          </blockquote>
          <div className="manifesto__signoff">
            PARAKLETUS HUB NIGERIA — BOARD OF TRUSTEES
          </div>
        </div>
      </section>

      {/* ─── ECOSYSTEM PILLARS ─── */}
      <section id="pillars" className="pillars">
        <div className="pillars__head">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            The Framework
          </div>
          <h2 className="section-title">An Integrated Ecosystem</h2>
          <p className="section-lede">
            By coordinating engineering, training, and literature, we create a self-sustaining
            circle of innovation. Knowledge informs technology, and technology powers dissemination.
          </p>
        </div>

        <div className="pillars__grid">
          {/* Pillar 1: Technology */}
          <div className="pillar pillar--tech">
            <span className="pillar__num">01</span>
            <span className="pillar__kicker">INFRASTRUCTURE</span>
            <h3 className="pillar__title">Parakletus Technologies</h3>
            <p className="pillar__lede">
              We design robust cloud networks, local school management systems, and specialized
              blockchain tools to facilitate micro-payments and decentralized logistics.
            </p>
            <div className="pillar__surface">
              <span className="pillar__surface-label">ENGINEERING STANDARD</span>
              <p>Scalable APIs, Rust/Go microservices, and AI-enabled diagnostics.</p>
            </div>
            <a href="#solutions" className="pillar__link">
              Explore Tech Solutions
            </a>
            {/* Abstract background etch */}
            <div className="pillar__etch">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <rect x="10" y="10" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>

          {/* Pillar 2: Publishing */}
          <div className="pillar pillar--pub">
            <span className="pillar__num">02</span>
            <span className="pillar__kicker">LITERATURE</span>
            <h3 className="pillar__title">Parakletus Publishing</h3>
            <p className="pillar__lede">
              Fostering intellectual autonomy by editing, refining, and publishing rigorous,
              peer-reviewed textbooks, professional journals, and cultural literature.
            </p>
            <div className="pillar__surface">
              <span className="pillar__surface-label">EDITORIAL REACH</span>
              <p>Textbooks aligned with national curricula, digital-first distribution.</p>
            </div>
            <a href="#solutions" className="pillar__link">
              Explore Catalogues
            </a>
            {/* Abstract background etch */}
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

      {/* ─── SOLUTIONS BENTO SPOTLIGHT ─── */}
      <section id="solutions" className="solutions">
        <div className="solutions__head">
          <h2 className="section-title">Spotlight Solutions</h2>
          <p className="section-lede">
            Each project is built to address critical structural constraints, providing stable,
            high-capacity tools tailored for African institutional realities.
          </p>
        </div>

        <div className="solutions__bento">
          {/* Main Bento Spotlight: ParaLearn LMS */}
          <div className="sol sol--lg sol--ember">
            <div className="sol__head">
              <div className="sol__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12.5V16a6 6 0 0012 0v-3.5" />
                </svg>
              </div>
              <span className="sol__tag">FLAGSHIP SOFTWARE</span>
            </div>
            <h3 className="sol__name">ParaLearn LMS Platform</h3>
            <p className="sol__desc">
              A comprehensive, cloud-based School Management System (SMS) and Learning Management
              System (LMS). Built to operate under low-bandwidth constraints, ParaLearn streamlines
              grade-books, timetables, and fee-management while hosting interactive student learning
              modules offline.
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

          {/* Medium Bento: Ayọ̀lọ̀ Ledger */}
          <div className="sol sol--md sol--ink">
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
              Leveraging stablecoin networks to enable secure, compliant, and near-zero-fee
              remittance and payments for developers and businesses across West Africa.
            </p>
            <div className="sol__foot" style={{ marginTop: "auto" }}>
              <a href="#contact" className="sol__more">Read Technical Spec →</a>
            </div>
          </div>

          {/* Medium Bento: SabiNote */}
          <div className="sol sol--md sol--cream">
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
              A collaborative academic publishing network hosting crowdsourced lecture summaries,
              peer-reviewed notes, and standardized study guides.
            </p>
            <div className="sol__foot" style={{ marginTop: "auto" }}>
              <a href="#contact" className="sol__more">Browse SabiNote Hub →</a>
            </div>
          </div>

          {/* Status Flag Card */}
          <div className="sol sol--flag">
            <div className="sol-flag__pulse">
              <span />
              <span />
              <span />
            </div>
            <div className="sol-flag__num">24/7</div>
            <div className="sol-flag__label">CORE SYSTEM OPERATIONS ONLINE</div>
            <div className="sol-flag__copy">
              <p>Our distributed microservices guarantee 99.98% uptime for primary school pipelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ZEBRA SECTION ─── */}
      <section className="zebra">
        <div className="zebra__stripes">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="zebra__inner">
          <div className="zebra__head">
            <div className="section-eyebrow section-eyebrow--light">
              <span className="section-eyebrow__dot" />
              Structural Alignment
            </div>
            <h2 className="zebra__title" style={{ color: "#FFFDF7" }}>
              Fostering <span className="serif-italic">Technological</span> Sovereignty.
            </h2>
          </div>

          <div className="zebra__body">
            <p className="zebra__copy">
              We design tools that respect regional realities: high mobile-first reliance, expensive
              metered internet, and intermittent power grids. We do not copy-paste Silicon Valley templates;
              we construct native infrastructure.
            </p>

            <ul className="zebra__pillars">
              <li>
                <span className="zebra__k">Locally Hosted Nodes</span>
                <span className="zebra__v">Edge servers situated inside regional schools ensure instant platform load times.</span>
              </li>
              <li>
                <span className="zebra__k">Stable Ledger Compliant</span>
                <span className="zebra__v">Full alignment with regulatory bodies regarding digital assets and fiscal flows.</span>
              </li>
            </ul>
          </div>

          {/* Premium Blockquote */}
          <div className="zebra__quote">
            <div className="zebra__quote-mark">“</div>
            <div>
              <p>
                By building robust operating software for schools and seamless settlement rails for
                engineers, we pave the way for sustainable development that starts from within.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUBSIDIARY BRANDS ─── */}
      <section className="brands">
        <div className="brands__head" style={{ maxWidth: 1180, margin: "0 auto 48px" }}>
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Our Operations
          </div>
          <h2 className="section-title">The Subsidiary Grid</h2>
        </div>

        <div className="brands__grid">
          {/* Brand Card 1 */}
          <div className="brandcard">
            <div className="brandcard__top">
              <span className="brandcard__code">PARALEARN</span>
              <span className="brandcard__idx">01 // EDU</span>
            </div>
            <h3 className="brandcard__name">ParaLearn Academy</h3>
            <p className="brandcard__desc"> Fostering technical competence through high-yield software development bootcamps and executive digital training. </p>
          </div>

          {/* Brand Card 2 */}
          <div className="brandcard">
            <div className="brandcard__top">
              <span className="brandcard__code">AYỌ̀LỌ̀</span>
              <span className="brandcard__idx">02 // TECH</span>
            </div>
            <h3 className="brandcard__name">Ayọ̀lọ̀ Systems</h3>
            <p className="brandcard__desc"> Architecting and deploying distributed ledger gateways and stablecoin infrastructure for business transactions. </p>
          </div>

          {/* Brand Card 3 */}
          <div className="brandcard">
            <div className="brandcard__top">
              <span className="brandcard__code">SABINOTE</span>
              <span className="brandcard__idx">03 // PUB</span>
            </div>
            <h3 className="brandcard__name">SabiNote Publishing</h3>
            <p className="brandcard__desc"> Commissioning and printing high-utility physical textbooks, study aids, and peer-reviewed educational literature. </p>
          </div>
        </div>
      </section>

      {/* ─── IMPACT SECTION ─── */}
      <section id="impact" className="impact">
        <div className="impact__head">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Empirical Results
          </div>
          <h2 className="section-title">Metrics of Reach</h2>
        </div>

        <div className="impact__grid">
          {/* Metric 1 */}
          <div className="impactrow">
            <div className="impactrow__k">24k</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Students Enrolled</div>
              <div className="impactrow__note">Actively utilizing our LMS software daily.</div>
            </div>
          </div>
          {/* Metric 2 */}
          <div className="impactrow">
            <div className="impactrow__k">₦8.5B</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Settled Value</div>
              <div className="impactrow__note">On-chain transaction throughput processed.</div>
            </div>
          </div>
          {/* Metric 3 */}
          <div className="impactrow">
            <div className="impactrow__k">140+</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Institutions</div>
              <div className="impactrow__note">Primary and secondary schools integrated.</div>
            </div>
          </div>
          {/* Metric 4 */}
          <div className="impactrow">
            <div className="impactrow__k">18k</div>
            <div className="impactrow__body">
              <div className="impactrow__label">Textbooks</div>
              <div className="impactrow__note">Rigorous reference materials printed and shipped.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM SECTION ─── */}
      <section id="team" className="team">
        <div className="team__head">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Leadership
          </div>
          <h2 className="section-title">Hub Directors</h2>
        </div>

        <div className="team__grid">
          {/* Member 1 */}
          <div className="member">
            <div className="member__portrait">
              <div className="member__portrait-bg" style={{ background: "linear-gradient(135deg, #FFE0C2 0%, #FFFDF7 100%)" }} />
              <div className="member__monogram">OA</div>
              <div className="member__placeholder">EXECUTIVE</div>
            </div>
            <span className="member__role">CEO & FOUNDER</span>
            <h3 className="member__name">Oluwatobi O. A.</h3>
            <p className="member__bio"> Fostering technological enterprise and directing operational strategy across technological, financial, and publishing spheres. </p>
          </div>

          {/* Member 2 */}
          <div className="member">
            <div className="member__portrait">
              <div className="member__portrait-bg" style={{ background: "linear-gradient(135deg, #FFE9CD 0%, #FFFDF7 100%)" }} />
              <div className="member__monogram">CN</div>
              <div className="member__placeholder">TECHNOLOGY</div>
            </div>
            <span className="member__role">CHIEF TECH ARCHITECT</span>
            <h3 className="member__name">Chidi N.</h3>
            <p className="member__bio"> Leading microservice engineering, stablecoin rail architecture, and core ParaLearn software development. </p>
          </div>

          {/* Member 3 */}
          <div className="member">
            <div className="member__portrait">
              <div className="member__portrait-bg" style={{ background: "linear-gradient(135deg, #FFEFDD 0%, #FFFDF7 100%)" }} />
              <div className="member__monogram">AO</div>
              <div className="member__placeholder">EDITORIAL</div>
            </div>
            <span className="member__role">CHIEF EDITOR & ADVISOR</span>
            <h3 className="member__name">Prof. Adebayo O.</h3>
            <p className="member__bio"> Curating educational textbooks, academic review standards, and coordinating national syllabus alignment. </p>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL CALL-TO-ACTION ─── */}
      <section id="contact" className="cta">
        <div className="cta__sun" />
        <div className="cta__inner">
          <div className="section-eyebrow section-eyebrow--light">
            <span className="section-eyebrow__dot" />
            Next Step
          </div>
          <h2 className="cta__title">
            Partner With <span className="serif-italic">Parakletus</span> today.
          </h2>
          <p className="cta__lede">
            Whether you are a school director wishing to integrate ParaLearn, a business needing
            compliantly structured stablecoin billing, or an academic writer seeking publication,
            reach out to our Lagos desk today.
          </p>

          <div className="cta__lanes">
            <div className="lane">
              <span className="lane__kicker">SCHOOL OPERATION</span>
              <h3 className="lane__title">Integrate ParaLearn</h3>
              <p className="lane__meta">Request custom software onboarding &edge node deployment.</p>
            </div>
            <div className="lane">
              <span className="lane__kicker">FINANCIAL BILLING</span>
              <h3 className="lane__title">Utilize Ayọ̀lọ̀ Rails</h3>
              <p className="lane__meta">Apply for API keys to support stablecoin settlements.</p>
            </div>
            <div className="lane">
              <span className="lane__kicker">ACADEMIC PRESS</span>
              <h3 className="lane__title">Submit Manuscripts</h3>
              <p className="lane__meta">Get rigorous textbook publication services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EDITORIAL FOOTER ─── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__lockup">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--c-ember)" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--c-ember-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="footer__name">PARAKLETUS HUB NIGERIA</span>
            </div>
            <p className="footer__caption">
              Rigorous technology and educational systems built for African operational realities.
            </p>
            <div className="footer__cac">
              RC NUMBER: 1845920
            </div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__h">Solutions</div>
              <ul>
                <li><a href="#solutions">ParaLearn LMS</a></li>
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
