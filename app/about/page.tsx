"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const team = [
  {
    initials: "EI",
    name:     "Evander Ikechukwu",
    role:     "CEO & FOUNDER",
    label:    "EXECUTIVE",
    bio:      "Directing the overall vision and operational strategy of Parakletus Hub Nigeria across technology, publishing, and finance.",
    bg:       "linear-gradient(135deg,#BDE8CE 0%,#F7FCF9 100%)",
  },
  {
    initials: "OE",
    name:     "Olajide Emmanuel",
    role:     "CHIEF TECHNOLOGY OFFICER",
    label:    "TECHNOLOGY",
    bio:      "Architecting the microservices backbone, stablecoin rail infrastructure, and the core ParaLearn software platform.",
    bg:       "linear-gradient(135deg,#C8EDD9 0%,#F2FAF5 100%)",
  },
  {
    initials: "IU",
    name:     "Ifunaya Udeh",
    role:     "PRODUCT MANAGER",
    label:    "PRODUCT",
    bio:      "Owning the product roadmap, coordinating cross-functional delivery, and ensuring every build ships on time and on spec.",
    bg:       "linear-gradient(135deg,#D0EEE2 0%,#F2FAF5 100%)",
  },
  {
    initials: "TW",
    name:     "Taiwo",
    role:     "DESIGN LEAD",
    label:    "DESIGN",
    bio:      "Crafting the visual identity, design system, and user experience across every Parakletus product and brand touchpoint.",
    bg:       "linear-gradient(135deg,#D6F0E4 0%,#FEFFFC 100%)",
  },
];

export default function AboutPage() {
  const [scrolled, setScrolled]   = useState(false);
  const [timeStr, setTimeStr]     = useState("00:00:00");
  const [menuOpen, setMenuOpen]   = useState(false);

  const navLinks = [
    { label: "About Us",     href: "/about"        },
    { label: "Subsidiaries", href: "/subsidiaries" },
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
      setTimeStr(
        `${String(wat.getHours()).padStart(2,"0")}:${String(wat.getMinutes()).padStart(2,"0")}:${String(wat.getSeconds()).padStart(2,"0")}`
      );
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
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div>

      {/* MOBILE OVERLAY NAV */}
      <div className={`nav__overlay ${menuOpen ? "is-open" : ""}`}>
        <nav className="nav__overlay-links">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav__overlay-link"
              onClick={() => setMenuOpen(false)}
            >
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
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline", marginLeft: 4 }}>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
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
                className={`nav__link ${link.href === "/about" ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__right">
            <div className="nav__status">
              <span className="nav__status-dot" />
              <span className="nav__status-label">LAGOS LIVE</span>
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

      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <div className="section-eyebrow reveal">
            <span className="section-eyebrow__dot" />
            Who We Are
          </div>
          <h1 className="about-hero__title reveal" data-delay="1">
            The people building<br />
            <span className="serif-italic">Africa&rsquo;s</span> infrastructure.
          </h1>
          <p className="about-hero__lede reveal" data-delay="2">
            Parakletus Hub Nigeria is a Lagos-based technology and publishing company. We build
            school management software, stablecoin payment rails, and peer-reviewed educational
            literature — all engineered for the operational realities of the Global South.
          </p>
        </div>
      </section>

      {/* MISSION STRIP */}
      <section className="about-mission reveal">
        <div className="about-mission__inner">
          <div className="about-mission__stat">
            <span className="about-mission__k">2021</span>
            <span className="about-mission__v">Founded in Lagos</span>
          </div>
          <div className="about-mission__stat">
            <span className="about-mission__k">3</span>
            <span className="about-mission__v">Core subsidiaries</span>
          </div>
          <div className="about-mission__stat">
            <span className="about-mission__k">140+</span>
            <span className="about-mission__v">Institutions served</span>
          </div>
          <div className="about-mission__stat">
            <span className="about-mission__k">24k</span>
            <span className="about-mission__v">Students on platform</span>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team about-team">
        <div className="team__head reveal">
          <div className="section-eyebrow">
            <span className="section-eyebrow__dot" />
            Leadership
          </div>
          <h2 className="section-title">The Core Team</h2>
          <p className="section-lede" style={{ maxWidth: 540 }}>
            A tight group of builders, designers, and strategists committed to raising the
            technological ceiling for African institutions.
          </p>
        </div>

        <div className="team__grid about-team__grid">
          {team.map((member, i) => (
            <div key={member.initials} className="member reveal" data-delay={String(i + 1)}>
              <div className="member__portrait">
                <div className="member__portrait-bg" style={{ background: member.bg }} />
                <div className="member__monogram">{member.initials}</div>
                <div className="member__placeholder">{member.label}</div>
              </div>
              <span className="member__role">{member.role}</span>
              <h3 className="member__name">{member.name}</h3>
              <p className="member__bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="about-values__inner">
          <div className="about-values__head reveal">
            <div className="section-eyebrow">
              <span className="section-eyebrow__dot" />
              Our Principles
            </div>
            <h2 className="section-title">What drives us</h2>
          </div>
          <div className="about-values__grid">
            {[
              { n: "01", k: "Native Infrastructure", v: "We build for African constraints — intermittent power, expensive data, mobile-first users. Not copies of Silicon Valley products." },
              { n: "02", k: "Institutional Trust",   v: "Every product we ship must earn the confidence of schools, regulators, and the families they serve. Trust is non-negotiable." },
              { n: "03", k: "Knowledge Sovereignty", v: "African curricula, African voices, African publishing. We believe the Global South should author its own intellectual record." },
              { n: "04", k: "Long-Term Thinking",    v: "We are building decade-spanning infrastructure, not short-cycle apps. Decisions are made with permanence in mind." },
            ].map((v) => (
              <div key={v.n} className="about-values__item reveal" data-delay={v.n === "01" ? "1" : v.n === "02" ? "2" : v.n === "03" ? "3" : "4"}>
                <span className="about-values__num">{v.n}</span>
                <h3 className="about-values__k">{v.k}</h3>
                <p className="about-values__v">{v.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
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
            Whether you&rsquo;re a school director, fintech builder, or academic writer — our Lagos desk is ready.
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
            <p className="footer__caption">Rigorous technology and educational systems built for African institutional realities.</p>
            <div className="footer__cac">RC NUMBER: 1845920</div>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__h">Solutions</div>
              <ul>
                <li><Link href="/#solutions">ParaLearn</Link></li>
                <li><Link href="/#solutions">Ayọ̀lọ̀ Payments</Link></li>
                <li><Link href="/#solutions">SabiNote Pubs</Link></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Framework</div>
              <ul>
                <li><Link href="/#pillars">Technology</Link></li>
                <li><Link href="/#pillars">Publishing</Link></li>
                <li><Link href="/#pillars">Education</Link></li>
              </ul>
            </div>
            <div className="footer__col">
              <div className="footer__h">Team</div>
              <ul>
                <li><Link href="/about">Leadership</Link></li>
                <li><Link href="/about">Advisory Board</Link></li>
                <li><Link href="/about">CAC Status</Link></li>
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
