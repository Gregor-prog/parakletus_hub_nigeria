"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const team = [
  {
    initials: "EI",
    name:     "Evander Ikechukwu",
    role:     "CEO & FOUNDER",
    label:    "EXECUTIVE",
    bio:      "Directing the overall vision and operational strategy of Parakletus Hub Nigeria across technology, publishing, and education.",
    bg:       "linear-gradient(135deg,#BDE8CE 0%,#F7FCF9 100%)",
    linkedin: "https://www.linkedin.com/in/evander-ikechukwu-371904202/",
    github:   undefined,
    image:    "/evander.png",
  },
  {
    initials: "OE",
    name:     "Olajide Emmanuel",
    role:     "CHIEF TECHNOLOGY OFFICER",
    label:    "TECHNOLOGY",
    bio:      "Architecting the product engineering systems and the core ParaLearn software infrastructure.",
    bg:       "linear-gradient(135deg,#C8EDD9 0%,#F2FAF5 100%)",
    linkedin: "https://www.linkedin.com/in/emmanuel-olajide-0b7a39297/",
    github:   "https://github.com/Gregor-prog",
    image:    "/olajide.jpg",
  },
  {
    initials: "IU",
    name:     "Ifunaya Udeh",
    role:     "PRODUCT MANAGER",
    label:    "PRODUCT",
    bio:      "Owning the product roadmap, coordinating cross-functional delivery, and ensuring every build ships on time and on spec.",
    bg:       "linear-gradient(135deg,#D0EEE2 0%,#F2FAF5 100%)",
    linkedin: "https://www.linkedin.com/in/ifunaya-udeh-769825353/",
    github:   undefined,
    image:    "/ifunaya.jpg",
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
            Parakletus Hub Nigeria is a Port Harcourt-based education technology and publishing company
            serving K-12 schools and giving the teeming Nigerian youth access to quality education by
            leveraging technology — advancing SDG 4. We operate two divisions: an e-learning division,
            ParaLearn, and an academic publishing division, Parakletus Publishing. Registered with the
            C.A.C. under business number 1909664.
          </p>
        </div>
      </section>

      {/* MISSION STRIP */}
      <section className="about-mission reveal">
        <div className="about-mission__inner">
          <div className="about-mission__stat">
            <span className="about-mission__k">2021</span>
            <span className="about-mission__v">Founded in Port Harcourt, Nigeria</span>
          </div>
          <div className="about-mission__stat">
            <span className="about-mission__k">2</span>
            <span className="about-mission__v">Operating divisions</span>
          </div>
          <div className="about-mission__stat">
            <span className="about-mission__k">10+</span>
            <span className="about-mission__v">Institutions served</span>
          </div>
          <div className="about-mission__stat">
            <span className="about-mission__k">2k+</span>
            <span className="about-mission__v">Students on platform</span>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="about-values">
        <div className="about-values__inner">
          <div className="about-values__head reveal">
            <div className="section-eyebrow">
              <span className="section-eyebrow__dot" />
              Mission &amp; Vision
            </div>
            <h2 className="section-title">Why we exist</h2>
          </div>
          <div className="about-mv__grid">
            <div className="about-values__item reveal" data-delay="1">
              <span className="about-values__num">MISSION</span>
              <h3 className="about-values__k">Sustainable e-learning for Africa</h3>
              <p className="about-values__v">
                Our mission is to effect sustainable e-learning solutions in the African learning
                ecosystem and to change the narrative about technology in education in Africa.
              </p>
            </div>
            <div className="about-values__item reveal" data-delay="2">
              <span className="about-values__num">VISION</span>
              <h3 className="about-values__k">A frontier in digitized learning</h3>
              <p className="about-values__v">
                Our vision is to be a beacon of hope to the learning populace and a frontier in
                digitized learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team about-team" id="team">
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
              <div className="member__portrait" style={{ position: "relative", overflow: "hidden" }}>
                {member.image ? (
                  <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <>
                    <div className="member__portrait-bg" style={{ background: member.bg }} />
                    <div className="member__monogram">{member.initials}</div>
                  </>
                )}
                <div className="member__placeholder">{member.label}</div>
              </div>
              <span className="member__role">{member.role}</span>
              <h3 className="member__name">{member.name}</h3>
              <p className="member__bio">{member.bio}</p>
              <div className="member__socials" style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="member__social-link" style={{ color: "var(--c-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }} aria-label={`${member.name} LinkedIn`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.6 0h4.36v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.55v-6.6c0-1.58-.03-3.6-2.19-3.6-2.2 0-2.54 1.72-2.54 3.5V22H7.83V8z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="member__social-link" style={{ color: "var(--c-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }} aria-label={`${member.name} GitHub`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
              </div>
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
            Whether you&rsquo;re a school director, a teacher generating lesson notes, or an academic writer — our Port Harcourt desk is ready.
          </p>
          <div className="cta__lanes">
            <div className="lane reveal" data-delay="1">
              <span className="lane__kicker">SCHOOL OPERATION</span>
              <h3 className="lane__title">Integrate ParaLearn</h3>
              <p className="lane__meta">Set up your school&rsquo;s digital result system in under 30 minutes.</p>
            </div>
            <div className="lane reveal" data-delay="2">
              <span className="lane__kicker">TEACHER TOOLS</span>
              <h3 className="lane__title">Plan with SabiNote</h3>
              <p className="lane__meta">Generate NERDC-compliant lesson notes from your state&rsquo;s scheme of work.</p>
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
              <img src="/favicon.png" alt="Parakletus Hub Nigeria" width="36" height="36" style={{ objectFit: "contain", display: "block" }} />
            </div>
            <p className="footer__caption">Rigorous technology and educational systems built for African institutional realities.</p>
            <div className="footer__cac">CAC BN: 1909664</div>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__h">Solutions</div>
              <ul>
                <li><a href="https://pln.ng" target="_blank" rel="noopener noreferrer">ParaLearn</a></li>
                <li><a href="https://sabinote.pln.ng" target="_blank" rel="noopener noreferrer">SabiNote</a></li>
                <li><a href="https://ijsds.org" target="_blank" rel="noopener noreferrer">IJSDS Journal</a></li>
                <li><a href="https://gsi.parakletushub.com" target="_blank" rel="noopener noreferrer">GSI Buildathon</a></li>
                <li><Link href="/#solutions">Ayọ̀lọ̀ (Roadmap)</Link></li>
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
                <li><Link href="/about#team">Leadership</Link></li>
                <li><Link href="/about#team">Advisory Board</Link></li>
                <li><Link href="/about#team">CAC Status</Link></li>
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
