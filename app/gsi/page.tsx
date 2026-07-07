"use client";

import React, { useState, useEffect } from "react";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/10nOWu3snYjOfWdxA2wcIkZeZTBFhdSmUkXeVR9nW9wI/viewform";

function pad(n: number) { return String(Math.max(0, n)).padStart(2, "0"); }

function useCountdown(targetISO: string) {
  const [cd, setCd] = useState({ d: "00", h: "00", m: "00", s: "00", live: false });
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => {
      let diff = target - Date.now();
      if (diff <= 0) { setCd({ d: "00", h: "00", m: "00", s: "00", live: true }); return; }
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);    diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      setCd({ d: pad(d), h: pad(h), m: pad(m), s: pad(s), live: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return cd;
}

const faqs = [
  { q: "Do I need Web3 / blockchain experience to apply?", a: "No. The whole point of the challenge is to hide the chain. We're looking for engineers who can read docs and ship clean APIs, and designers who can make complex systems feel obvious. Web3 plumbing is a bonus, not a baseline." },
  { q: "Is the Buildathon open to candidates outside Nigeria?", a: "Phase 01 prioritises Southern and Eastern Nigeria for the founding-team hire. Future editions will open to the wider Global South — Lagos, Nairobi, Lahore, Lima, Accra, Manila and beyond." },
  { q: "Does it cost anything to enter?", a: "No. Entry is free. Travel and accommodation to the Port Harcourt finale are sponsored for shortlisted teams." },
  { q: "Can I apply solo? With a friend?", a: "Apply solo. We pair you — one designer with one engineer — after the shortlist. This keeps the sample clean and forces fast, real collaboration under pressure." },
  { q: "Who owns the code we write during the sprint?", a: "All participants sign a simple agreement that GSI retains rights to the code produced during the 72-hour challenge. You retain full credit, attribution, and the right to showcase your work publicly afterwards." },
  { q: "What if I'm not picked for the founding team?", a: "Every shortlisted candidate enters our Talent Pipeline — a curated list shared with 12+ partner startups and tech firms across Africa. Many strong applicants are hired this way." },
];

export default function GsiPage() {
  const cd = useCountdown("2026-08-21T12:00:00+01:00");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  // fade-up observer
  useEffect(() => {
    const els = document.querySelectorAll(".gsi-root .fade-up:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in")); return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // smooth anchor scroll
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top, behavior: "smooth" });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const stripContent = Array.from({ length: 2 }, (_, i) => (
    <React.Fragment key={i}>
      <span><span className="dot" />GSI Buildathon · Vol. 01</span>
      <span className="sep">·</span>
      <span>Port Harcourt · Aug 22, 2026</span>
      <span className="sep">·</span>
      <span>Applications close Aug 1 — apply now</span>
      <span className="sep">·</span>
      <span>2 winners (1 physical + 1 virtual)</span>
      <span className="sep">·</span>
      <span>6-hour sprint · Aug 21</span>
      <span className="sep">·</span>
    </React.Fragment>
  ));

  return (
    <div className="gsi-root">

      {/* STRIP */}
      <div className="strip" aria-hidden="true">
        <div className="strip-track">{stripContent}</div>
      </div>

      {/* NAV */}
      <nav className="gsi-nav">
        <div className="nav-inner">
          <a className="brand" href="#">
            <img src="/gsi-logo.png" alt="GSI Buildathon" className="brand-mark" width="120" height="48" style={{ objectFit: "contain", display: "block" }} />
          </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#challenge">Challenge</a>
            <a href="#timeline">Timeline</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#apply">Apply</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#prizes">Prizes</a>
            <a href="#faq">FAQ</a>
          </div>
          <a className="nav-cta" href="#apply">
            <span className="dot" />Apply now
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="wrap">
          <div className="hero-layout">
            <div className="hero-main">
              <div className="hero-status fade-up in">
                <span className="dot" />
                <span>Applications close Aug 1 · Finale Aug 22, 2026</span>
              </div>
              <h1 className="hero-title fade-up in d1">
                African research deserves<br />a <span className="accent">global stage.</span>
              </h1>
              <div className="manifesto fade-up in d2">
                <p>For too long, the systems that decide which academic work gets seen — and which gets ignored — have not been built for us.</p>
                <p className="mf-emph">The Global South Index (GSI) is changing that.</p>
                <p>A new academic indexing platform, designed specifically to give African and Global South researchers the recognition, reach, and permanence their work deserves. Built on technology that is fair, transparent, and community-owned.</p>
                <p className="mf-close">Because the future of global knowledge includes all of us.</p>
              </div>
              <div className="hero-bridge fade-up in d3">
                <span className="line" />
                <span className="text">Applications are open. <strong>Apply before they close.</strong></span>
              </div>
              <div className="hero-vol fade-up in d4">
                <a href="https://forms.gle/gP9ZpNdm7dcmJx4N8" target="_blank" rel="noopener noreferrer" className="hero-vol-btn">
                  Become a volunteer →
                </a>
                <span className="hero-vol-hint">7 roles · Port Harcourt · Aug 22</span>
              </div>
            </div>

            <aside className="vitals fade-up in d2">
              <div className="vitals-head">
                <span className="vitals-tag">Buildathon · Vol. 01</span>
                <span className="vitals-live"><span className="d" />Applications Open</span>
              </div>
              <dl className="vitals-list">
                <div className="vitals-row"><dt>Finale</dt><dd>Aug 22, 2026<span>Port Harcourt (Live + Virtual)</span></dd></div>
                <div className="vitals-row"><dt>Sprint</dt><dd>6 Hours<span>Aug 21, 2026 · 12pm WAT</span></dd></div>
                <div className="vitals-row"><dt>Format</dt><dd>Product Teams<span>PMs, designers, engineers</span></dd></div>
                <div className="vitals-row"><dt>Reward</dt><dd>2 Winners Hired<span>1 Physical + 1 Virtual</span></dd></div>
              </dl>
              <div className="vitals-cd">
                <div className="vitals-cd-head">
                  <span className="vitals-cd-lab">{cd.live ? "Sprint has begun" : "Sprint begins in"}</span>
                  <span className="vitals-cd-date">Aug 21</span>
                </div>
                <div className="vitals-cd-grid">
                  <div><span className="n">{cd.d}</span><span className="u">Days</span></div>
                  <div><span className="n">{cd.h}</span><span className="u">Hrs</span></div>
                  <div><span className="n">{cd.m}</span><span className="u">Min</span></div>
                  <div><span className="n">{cd.s}</span><span className="u">Sec</span></div>
                </div>
              </div>
              <div className="vitals-cta">
                <a className="btn btn-primary" href="#apply">Apply now <span className="arr">→</span></a>
                <a className="btn btn-ghost" href="#about">About the Buildathon</a>
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">The Buildathon</div>
            <h2 className="display-2">And this is how we build it.</h2>
            <p className="lede">The GSI Buildathon is how we're hiring the founding team — and how we're mapping the top 1% of design and engineering talent across Southern and Eastern Nigeria. 6-hour sprint. Balanced product teams. One MVP that has to feel inevitable.</p>
          </div>
          <div className="about-grid">
            <div className="about-left fade-up">
              <p>We didn't want to write a job posting. <em>So we built a stage.</em></p>
              <div className="signature">The GSI Team<br />Port Harcourt, Nigeria</div>
            </div>
            <div className="stat-list fade-up d2">
              <div className="stat">
                <div className="stat-num">1<sup>%</sup></div>
                <div className="stat-body"><h3>Top-tier talent only</h3><p>Open call across community chapters, GDGs, and tech hubs in the South and East.</p></div>
              </div>
              <div className="stat">
                <div className="stat-num">2</div>
                <div className="stat-body"><h3>Founding roles on offer</h3><p>Hiring key designers, developers, and product leads live from the finale stage.</p></div>
              </div>
              <div className="stat">
                <div className="stat-num">6<sup>h</sup></div>
                <div className="stat-body"><h3>Live sprint</h3><p>A fast-paced sprint to build and ship the "Proof of Impact" Academic Node.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section className="section challenge" id="challenge">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">The brief</div>
            <h2 className="display-2">Build the &quot;Proof of Impact&quot; Academic Node.</h2>
            <p className="lede">Currently, Western platforms rank research strictly by global citations, ignoring local impact. <strong>Your task is to build a &quot;Proof of Impact&quot; Academic Portal.</strong> Teams must build a lightweight Web3 application where a researcher can upload the metadata of a local African research paper (e.g., Title, Abstract, Field, Local Policy Mentions, and Open-Access Citations). The system must process this data, calculate a unique <strong>&quot;GSI Score&quot;</strong>, and display the indexed paper on a clean public dashboard.</p>
          </div>
          <div className="chal-grid">
            <div className="chal-steps fade-up">
              {[
                { n: "01", h: "Algorithms & Logic (25 pts)", p: "Write a backend algorithm or smart contract that processes inputs (like local citations, government policy mentions, and NGO adoptions) and calculates a weighted GSI Score. Utilize Space and Time (SXT) SQL queries or Avalanche smart contracts to store and process this logic." },
                { n: "02", h: "Design & UI/UX (20 pts)", p: "Build the frontend interface containing a submission form for researchers and a public dashboard showing scores. Keep the design clean, intuitive, and accessible for older professors, avoiding Web3/crypto complexity." },
                { n: "03", h: "Usecase & Viability (20 pts)", p: "Ensure the product directly aligns with GSI's mission to highlight Global South research. Show practical value that an institution's VC would immediately recognize, bypassing traditional paywalls." },
                { n: "04", h: "Collaboration (15 pts)", p: "Work seamlessly as a cohesive unit during the 6-hour sprint. Show a balanced, active commit history in GitHub across product design, frontend, and backend components." },
                { n: "05", h: "Presentation (20 pts)", p: "Deliver a compelling 5-minute pitch (3 minutes for a live working demo, 2 minutes explaining your Web3 architecture) followed by Q&A with the judges." },
              ].map((s) => (
                <div key={s.n} className="chal-step">
                  <div className="n">{s.n}</div>
                  <div><h4>{s.h}</h4><p>{s.p}</p></div>
                </div>
              ))}
            </div>
            <div className="fade-up d2">
              <div className="preview" aria-hidden="true">
                <div className="preview-bar">
                  <div className="lights"><span /><span /><span /></div>
                  <span>gsi.app</span>
                </div>
                <div className="preview-body">
                  <div className="prev-h">Welcome back.</div>
                  {[
                    { t: "Journal of African Sociology · Vol. 14", sub: "openalex · 42 citations · Q2", score: "8.4" },
                    { t: "Indigenous Knowledge Systems Review",    sub: "openalex · 28 citations · Q1", score: "9.1" },
                    { t: "Niger Delta Public Health Quarterly",   sub: "openalex · 17 citations · Q3", score: "7.6" },
                  ].map((r) => (
                    <div key={r.t} className="prev-row">
                      <div><div className="t">{r.t}</div><div className="sub">{r.sub}</div></div>
                      <div className="score">{r.score}</div>
                    </div>
                  ))}
                  <div className="prev-cta"><span>Save journal · permanent record</span><span className="mono">→</span></div>
                </div>
              </div>
              <div className="no-crypto" style={{ marginBottom: "20px" }}>
                <span>No</span>
                {["gas fees","wallets","seed phrases",'"Web3 magic"'].map((s) => <span key={s} className="strike">{s}</span>)}
                <span className="ok">— just product.</span>
              </div>
              <div className="protip-card" style={{
                background: "rgba(31, 138, 91, 0.04)",
                border: "1px solid rgba(31, 138, 91, 0.15)",
                padding: "20px",
                borderRadius: "10px",
                fontSize: "14px",
                lineHeight: "1.55"
              }}>
                <div style={{ fontWeight: 700, color: "var(--green)", marginBottom: "8px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}>
                  💡 Pro-Tip for the Briefing Session
                </div>
                <div style={{ fontStyle: "italic", color: "var(--ink-mute)" }}>
                  &ldquo;Do not spend 4 hours arguing about the perfect math formula. Spend 30 minutes designing a basic algorithm, and spend the remaining 5.5 hours making sure the data flows smoothly from the user interface, through your algorithm, and onto the blockchain/database. We are scoring execution, not just ideas.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section" id="timeline">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">Timeline</div>
            <h2 className="display-2">Five phases, one stage.</h2>
            <p className="lede">From application deadline to the live finale in Port Harcourt — here's how the timeline unfolds.</p>
          </div>
          <div className="tl fade-up">
            {[
              { now: true,  label: "Phase 01 · Now", date: "August 1",  name: <>Application <em>deadline</em></>, desc: "Open call for all tracks closes. Ensure your portfolio and GitHub profile are fully updated and submitted." },
              { now: false, label: "Phase 02",        date: "August 2",  name: "Grouping & task allocation", desc: "Shortlisted candidates are grouped into balanced product teams and assigned build slots." },
              { now: false, label: "Phase 03",        date: "August 15", name: "Onboarding & briefs", desc: "Official briefing session, developer environment setups, and distribution of APIs/contracts." },
              { now: false, label: "Phase 04",        date: "August 21 @ 12pm",name: <>Submission <em>portal opens</em></>, desc: "Portal opens for code pushes and design mocks. Teams prepare to finalize and launch." },
              { now: false, label: "Phase 05 · Finale",date:"August 22",         name: <>Port Harcourt <em>finale</em></>,       desc: "Two phases merged to one stage. Top teams gather live in Port Harcourt to present, pitch, and demo to the judges." },
            ].map((p) => (
              <div key={p.label} className={`tl-phase${p.now ? " now" : ""}`}>
                <div className="tl-num"><i className="d" />{p.label}</div>
                <div className="tl-date">{p.date}</div>
                <div className="tl-name">{p.name}</div>
                <div className="tl-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="section" id="roadmap">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">The Platform</div>
            <h2 className="display-2">The researcher&rsquo;s wishlist.</h2>
            <p className="lede">Here&rsquo;s what we&rsquo;ve committed to building — decided, scoped, and funded for the first release. Plus what comes next.</p>
          </div>
          <div className="roadmap-grid">
            <div className="roadmap-col fade-up">
              <div className="roadmap-col-label">Committed to ship</div>
              <div className="roadmap-list">
                {[
                  { h: "OpenAlex publication import", sub: "Full history: papers, citations, co-authorships in one view." },
                  { h: "Transparent GSI Score", sub: "Explainable, fair scoring that rewards depth — not Western citation politics." },
                  { h: "One-click blockchain save", sub: "No wallets, no gas, no seed phrases. A professor should never see crypto jargon." },
                  { h: "Journal onboarding dashboard", sub: "The MVP every researcher meets first — calm, fast, mobile-friendly." },
                ].map((item) => (
                  <div key={item.h} className="roadmap-item">
                    <div className="roadmap-icon roadmap-icon--done" aria-hidden="true">
                      <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
                    </div>
                    <div className="roadmap-item-text">
                      <div className="roadmap-item-h">{item.h}</div>
                      <div className="roadmap-item-sub">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="roadmap-col fade-up d2">
              <div className="roadmap-col-label">Roadmap</div>
              <div className="roadmap-list">
                {[
                  { h: "Public researcher profiles", sub: "Citation graphs, impact scores, and publication history — shareable by link." },
                  { h: "Institution-level indexing", sub: "Department and faculty dashboards for universities and research centres." },
                  { h: "Semantic Scholar cross-reference", sub: "Expand beyond OpenAlex — deeper coverage for Global South outputs." },
                  { h: "Open API for institutions", sub: "Structured access so third-party tools can build on GSI data." },
                  { h: "Mobile-first offline access", sub: "Fieldwork researchers shouldn’t need a stable connection to submit work." },
                  { h: "Community peer review layer", sub: "Researcher-moderated quality signals, separate from the score algorithm." },
                ].map((item) => (
                  <div key={item.h} className="roadmap-item">
                    <div className="roadmap-icon roadmap-icon--todo" aria-hidden="true" />
                    <div className="roadmap-item-text">
                      <div className="roadmap-item-h">{item.h}</div>
                      <div className="roadmap-item-sub">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section className="section apply-wrap" id="apply">
        <div className="wrap">
          <div className="apply-grid">
            <div className="fade-up">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <div className="eyebrow">Apply</div>
                <h2 className="display-2">Applications are open.</h2>
                <p className="lede">Submit your application now. We review every submission personally — shortlisted candidates are emailed within 5 days of the close date alongside the official brief, judging rubric, and sprint timeline.</p>
              </div>
              <ul className="apply-meta-list">
                {["Official brief and judging rubric on acceptance","Direct email notification on shortlist decision","Priority consideration for the founding team offer","Talent pipeline access — 12+ partner startups"].map((t) => (
                  <li key={t}><span className="check">✓</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="apply-gcta fade-up d2">
              <span className="apply-gcta-badge">Official Application</span>
              <h3 className="apply-gcta-h">Apply now.</h3>
              <p className="apply-gcta-p">
                The application is on Google Forms — takes 3 minutes, no account required. We review every submission personally and email shortlisted candidates within 5 days of close.
              </p>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-gcta-btn"
              >
                Open Application Form <span className="arr">→</span>
              </a>
              <div className="apply-gcta-note">
                Sprint begins <strong>August 21, 2026</strong> · Finale August 22 in Port Harcourt.
              </div>
              <div className="apply-gcta-divider" />
              <div className="apply-gcta-privacy">
                Your information is used only for this Buildathon. We don&rsquo;t sell, share, or spam.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VOLUNTEER */}
      <section className="vol-section" id="volunteer">
        <div className="wrap">
          <div className="vol-inner fade-up">
            <div className="vol-text">
              <div className="vol-eyebrow">
                <span className="dot" />
                <span>Volunteer</span>
              </div>
              <h2 className="vol-title">Help make the<br />event happen.</h2>
              <p className="vol-body">
                Seven roles. One event in Port Harcourt. Whether you&rsquo;re managing the stage schedule, keeping teams compliant, handling VIP protocol, overseeing logistics, or covering it on social media — pick your function and help us run the buildathon that finds Nigeria&rsquo;s next great builders.
              </p>
            </div>
            <div className="vol-cta-col">
              <a href="https://forms.gle/gP9ZpNdm7dcmJx4N8" target="_blank" rel="noopener noreferrer" className="vol-btn">
                Become a volunteer →
              </a>
              <div className="vol-roles">
                {["Event Day Programmes", "Compliance & Continuity", "Branding & Design", "Registration & Correspondence", "Protocol", "Budget & Finance", "Welfare & Logistics"].map((r) => (
                  <span key={r} className="vol-role-tag">{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="section" id="who">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">Founding roles</div>
            <h2 className="display-2">Six roles. Founding equity.</h2>
            <p className="lede">Every applicant is also a candidate for our partner startups — over a dozen firms looking for elite builders from the South/East to fill product, design, and engineering seats.</p>
          </div>
          <div className="who-grid">
            {[
              { tag: "Role 01 · Strategy", title: <>Founding <br /><em>Product Manager</em></>, bullet1: "Coordinates team focus and maps buildathon timelines.", bullet2: "Ensures the GSI score is understandable, clear and viable.", bullet3: "Familiar with research metrics and user-centric flows.", bullet4: "Bridges user interface layout with database queries." },
              { tag: "Role 02 · Engineering", title: <>Founding <br /><em>Frontend Engineer</em></>, bullet1: "Builds lightweight, calm, mobile-friendly interfaces.", bullet2: "Master of responsive layouts, visual hierarchy, and performance.", bullet3: "Works closely with the designer to implement precise UI flows.", bullet4: "Ensures the blockchain interactions run completely invisibly." },
              { tag: "Role 03 · Engineering", title: <>Founding <br /><em>Backend Engineer</em></>, bullet1: "Integrates APIs (like OpenAlex) and indexes data.", bullet2: "Processes scoring logic and weighted criteria efficiently.", bullet3: "Ensures robust backend microservices and reliable architecture.", bullet4: "Builds structured, well-typed database schemas and REST APIs." },
              { tag: "Role 04 · Engineering", title: <>Founding <br /><em>Fullstack Engineer</em></>, bullet1: "Bridges client views with server data pipelines.", bullet2: "Pragmatic, fast-moving, and ships every week.", bullet3: "Able to build a clean dashboard and link database nodes.", bullet4: "Loves to read documentation and solve direct end-user needs." },
              { tag: "Role 05 · Blockchain", title: <>Founding <br /><em>Blockchain Engineer</em></>, bullet1: "Handles Web3 plumbing: Avalanche/SXT smart contracts.", bullet2: "Obsessed with hiding complexity and removing wallet jargon.", bullet3: "Ensures secure, tamper-proof academic index saves.", bullet4: "Coordinates with frontend engineers on web3 event listening." },
              { tag: "Role 06 · Design", title: <>Founding <br /><em>Product Designer</em></>, bullet1: "Owns the GSI visual identity and typography systems.", bullet2: "Obsessed with clean spaces, breathing room, and alignment.", bullet3: "Familiar with design systems and standard Figma practices.", bullet4: "Bonus: shipped to African or Global South audiences." },
            ].map((r, idx) => (
              <div key={idx} className={`who-card fade-up${idx > 0 ? ` d${idx + 1}` : ""}`}>
                <div className="role-tag">{r.tag}</div>
                <h3>{r.title}</h3>
                <ul>
                  <li>{r.bullet1}</li>
                  <li>{r.bullet2}</li>
                  <li>{r.bullet3}</li>
                  <li>{r.bullet4}</li>
                </ul>
                <div className="who-foot"><span>Track</span><strong>Physical / Virtual</strong></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZES */}
      <section className="section" id="prizes">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">Prizes</div>
            <h2 className="display-2">Beyond the cash.</h2>
            <p className="lede">The real prize is the contract. But we've worked with Web3 sponsors and partner startups to make sure no one leaves Port Harcourt empty-handed.</p>
          </div>
          <div className="prize-grid">
            <div className="prize featured fade-up">
              <div className="rank">Physical Track Winner</div>
              <h4>Founding <em>team offer</em> + ₦TBD cash prize</h4>
              <div className="price">Live on stage · Port Harcourt</div>
              <p>Hired into the GSI founding team with equity, relocation stipend, and full-time role to build GSI from the first commit.</p>
            </div>
            <div className="prize featured fade-up d2">
              <div className="rank">Virtual Track Winner</div>
              <h4>Founding <em>team offer</em> + ₦TBD cash prize</h4>
              <div className="price">Remote contract · Global South</div>
              <p>Hired into the GSI founding team with equity, remote working contract, and same core opportunities to develop GSI systems.</p>
            </div>
            <div className="prize fade-up d3">
              <div className="rank">Talent Pipeline</div>
              <h4>Direct placements &amp; grants</h4>
              <div className="price">12+ partner startups</div>
              <p>Skip the line. Direct introductions, portfolio context, and hiring fast-track to partner startups and tech firms across Africa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section" id="partners">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">Partners</div>
            <h2 className="display-2">Built with four kinds of partners.</h2>
            <p className="lede">Final partner list publishes alongside applications on August 1. If you'd like to be on it — academic, community, startup or Web3 — we're listening.</p>
          </div>
          <div className="presenting fade-up">
            <div className="mark" aria-hidden="true">—</div>
            <div>
              <div className="lab">Presented by</div>
              <div className="name">Presenting partner — to be announced</div>
              <div className="lab" style={{ marginTop: 4, color: "var(--green)" }}>In partnership with Global South Index · 2026</div>
            </div>
          </div>
          <div className="partners-cats">
            {[
              { h: "01 · Academic",     t: "Credibility & reach" },
              { h: "02 · Community",    t: "Talent on the ground" },
              { h: "03 · Startups",     t: "Hiring pipeline" },
              { h: "04 · Web3 / DeSci", t: "Grants & rails" },
            ].map((c, i) => (
              <div key={c.h} className={`partners-cat fade-up${i > 0 ? ` d${i}` : ""}`}>
                <div className="cat-h">{c.h}</div>
                <div className="cat-t">{c.t}</div>
                <div className="cat-list">
                  <span className="placeholder">+ partner 01</span>
                  <span className="placeholder">+ partner 02</span>
                  <span className="placeholder">+ partner 03</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">FAQ</div>
            <h2 className="display-2">Frequently asked.</h2>
            <p className="lede">Anything we've missed? Email <a href="mailto:buildathon@globalsouthindex.org" style={{ color: "var(--ink)", borderBottom: "1px solid var(--line-3)" }}>buildathon@globalsouthindex.org</a> — the team gets back within 24 hours.</p>
          </div>
          <div className="faq-list fade-up">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${faqOpen === i ? " open" : ""}`} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <div className="faq-q">{f.q}</div>
                <div className="icn" aria-hidden="true" />
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENDCAP */}
      <section className="endcap">
        <div className="wrap">
          <h2>Build something the <em>world needs.</em></h2>
          <p>Applications are open now. Three days to ship. Two founding jobs on the line. One stage in Port Harcourt.</p>
          <a className="btn btn-primary" href="#apply">Apply now <span className="arr">→</span></a>
          <div className="endcap-foot">GSI Buildathon Vol. 01 · Port Harcourt, Nigeria · August 22, 2026</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <a className="brand" href="#">
                <img src="/gsi-logo.png" alt="GSI Buildathon" className="brand-mark" width="120" height="48" style={{ objectFit: "contain", display: "block" }} />
              </a>
              <p>A community-owned scholarly index, built on open infrastructure, for researchers the rest of the world keeps overlooking.</p>
              <div className="socials">
                {[
                  { label: "Twitter / X", path: "M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.012L4.5 22H1.244l8.03-9.176L1 2h7l4.85 6.41L18.244 2zm-2.4 18h1.9L7.25 4H5.25l10.594 16z" },
                  { label: "LinkedIn",    path: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.6 0h4.36v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.55v-6.6c0-1.58-.03-3.6-2.19-3.6-2.2 0-2.54 1.72-2.54 3.5V22H7.83V8z" },
                ].map((s) => (
                  <a key={s.label} className="soc" href="#" aria-label={s.label}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h5>Event</h5>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#challenge">Challenge</a></li>
                <li><a href="#timeline">Timeline</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
                <li><a href="#prizes">Prizes</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#volunteer">Volunteer</a></li>
              </ul>
            </div>
            <div>
              <h5>Partner with us</h5>
              <ul>
                <li><a href="mailto:buildathon@globalsouthindex.org">Academic</a></li>
                <li><a href="mailto:buildathon@globalsouthindex.org">Community</a></li>
                <li><a href="mailto:buildathon@globalsouthindex.org">Startup hiring</a></li>
                <li><a href="mailto:buildathon@globalsouthindex.org">Web3 sponsors</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bot">
            <span>© 2026 Global South Index · Port Harcourt, Nigeria</span>
            <span>Code of Conduct · Privacy · Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
