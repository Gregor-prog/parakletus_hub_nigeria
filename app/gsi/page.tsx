"use client";

import React, { useState, useEffect, useRef } from "react";

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
  const cd = useCountdown("2026-07-01T00:00:00+01:00");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [role, setRole] = useState("designer");
  const [formDone, setFormDone] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (!data.email || !data.name) return;
    try {
      const list = JSON.parse(localStorage.getItem("gsi.applicants") || "[]");
      list.push({ ...data, ts: Date.now() });
      localStorage.setItem("gsi.applicants", JSON.stringify(list));
    } catch (_) {}
    setSubmittedEmail(String(data.email));
    setFormDone(true);
  };

  const stripContent = Array.from({ length: 2 }, (_, i) => (
    <React.Fragment key={i}>
      <span><span className="dot" />GSI Buildathon · Vol. 01</span>
      <span className="sep">·</span>
      <span>Port Harcourt · Aug 22, 2026</span>
      <span className="sep">·</span>
      <span>72-hour remote sprint · Jul 20–23</span>
      <span className="sep">·</span>
      <span>2 founding roles on offer</span>
      <span className="sep">·</span>
      <span>Register now — applications open</span>
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
            <a href="#apply">Apply</a>
            <a href="#prizes">Prizes</a>
            <a href="#faq">FAQ</a>
          </div>
          <a className="nav-cta" href="#apply">
            <span className="dot" />Get notified
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
                <span>Something significant is coming · Aug 22, 2026</span>
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
                <span className="text">Something significant is coming. <strong>Stay close.</strong></span>
              </div>
            </div>

            <aside className="vitals fade-up in d2">
              <div className="vitals-head">
                <span className="vitals-tag">Buildathon · Vol. 01</span>
                <span className="vitals-live"><span className="d" />Coming</span>
              </div>
              <dl className="vitals-list">
                <div className="vitals-row"><dt>Finale</dt><dd>Aug 22, 2026<span>Port Harcourt, Nigeria</span></dd></div>
                <div className="vitals-row"><dt>Sprint</dt><dd>72 hours<span>Remote · Jul 20–23</span></dd></div>
                <div className="vitals-row"><dt>Format</dt><dd>2 builders / team<span>1 designer + 1 engineer</span></dd></div>
                <div className="vitals-row"><dt>Reward</dt><dd>Founding team offer<span>+ talent pipeline</span></dd></div>
              </dl>
              <div className="vitals-cd">
                <div className="vitals-cd-head">
                  <span className="vitals-cd-lab">{cd.live ? "Applications are live" : "Applications open in"}</span>
                  <span className="vitals-cd-date">Jul 1</span>
                </div>
                <div className="vitals-cd-grid">
                  <div><span className="n">{cd.d}</span><span className="u">Days</span></div>
                  <div><span className="n">{cd.h}</span><span className="u">Hrs</span></div>
                  <div><span className="n">{cd.m}</span><span className="u">Min</span></div>
                  <div><span className="n">{cd.s}</span><span className="u">Sec</span></div>
                </div>
              </div>
              <div className="vitals-cta">
                <a className="btn btn-primary" href="#apply">Get notified <span className="arr">→</span></a>
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
            <p className="lede">The GSI Buildathon is how we're hiring the founding team — and how we're mapping the top 1% of design and engineering talent across Southern and Eastern Nigeria. Three days. Two builders per team. One MVP that has to feel inevitable.</p>
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
                <div className="stat-body"><h3>Founding roles on offer</h3><p>One product designer. One software engineer. Hired live from the finale stage.</p></div>
              </div>
              <div className="stat">
                <div className="stat-num">72<sup>h</sup></div>
                <div className="stat-body"><h3>Remote sprint</h3><p>Three days to ship a working MVP — the Journal Onboarding Flow.</p></div>
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
            <h2 className="display-2">Build the onboarding a professor would actually use.</h2>
            <p className="lede">Your task is the MVP every researcher meets first — the Journal Onboarding Flow. A clean dashboard that pulls academic history from OpenAlex, calculates a researcher's GSI Score, and writes their journal to the blockchain. The hard part isn't the chain — it's making the chain disappear.</p>
          </div>
          <div className="chal-grid">
            <div className="chal-steps fade-up">
              {[
                { n: "01", h: "Pull academic history", p: "Use the OpenAlex API to import a researcher's publications, citations and co-authorships into a single, calm view." },
                { n: "02", h: "Compute the GSI Score", p: "Transparent, fair and explainable — the score should reward depth and rigour, not Western citation politics." },
                { n: "03", h: "Save to the blockchain — invisibly", p: "One button. No wallets. No gas. No seed phrases on screen. If a professor sees crypto jargon, you've already lost." },
                { n: "04", h: "Make it feel inevitable", p: "Prestigious-meets-modern. Bold typography, generous whitespace, real data, no slop. Ship something a VC would screenshot." },
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
                  <span>gsi.app / onboarding</span>
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
              <div className="no-crypto">
                <span>No</span>
                {["gas fees","wallets","seed phrases",'"Web3 magic"'].map((s) => <span key={s} className="strike">{s}</span>)}
                <span className="ok">— just product.</span>
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
            <h2 className="display-2">Five phases, one finale.</h2>
            <p className="lede">From open call to live hiring on stage in Port Harcourt — here's how the next four months unfold.</p>
          </div>
          <div className="tl fade-up">
            {[
              { now: true,  label: "Phase 01 · Now", date: "May 30 → Jul 1",  name: <>Marketing &amp; <em>applications</em></>, desc: "Open call across community chapters, GDGs, and tech hubs in the South and East. We collect portfolios and GitHub." },
              { now: false, label: "Phase 02",        date: "Jul 1 → Jul 15", name: "Selection & pairing",                    desc: "The team reviews every application. We shortlist by craft — projects shipped, code read, taste shown." },
              { now: false, label: "Phase 03",        date: "Jul 16 → Jul 18",name: "Mails & team formation",                 desc: "Shortlisted candidates are emailed and randomly paired — one designer with one engineer." },
              { now: false, label: "Phase 04",        date: "Jul 20 → Jul 23",name: <>The <em>72-hour</em> sprint</>,         desc: "Remote, three days, one prototype. Teams submit a working MVP and full design mockup." },
              { now: false, label: "Phase 05 · Finale",date:"Aug 22",         name: <>Port Harcourt <em>finale</em></>,       desc: "Top teams travel to Port Harcourt for a live coding sprint, presentations, and the awarding of job contracts." },
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

      {/* APPLY */}
      <section className="section apply-wrap" id="apply">
        <div className="wrap">
          <div className="apply-grid">
            <div className="fade-up">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <div className="eyebrow">Get notified</div>
                <h2 className="display-2">Be first in line when applications open.</h2>
                <p className="lede">Applications go live <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Jul 1, 2026</strong>. Drop your details now and we'll email you the moment they do — alongside the official brief, judging rubric and shortlist timeline.</p>
              </div>
              <ul className="apply-meta-list">
                {["Early access to the official brief and rubric","Direct email when applications open","Priority review for shortlist consideration","Talent pipeline access — 12+ partner startups"].map((t) => (
                  <li key={t}><span className="check">✓</span>{t}</li>
                ))}
              </ul>
            </div>
            <form className="applybox fade-up d2" onSubmit={handleSubmit} ref={formRef} noValidate>
              <div className="form-h">Tell us who you are.</div>
              <div className="form-sub">Free to submit. Takes 60 seconds.</div>
              <div className="form-grid">
                <div className="field full"><label htmlFor="ap-name">Full name</label><input className="input" type="text" id="ap-name" name="name" required placeholder="e.g. Adaeze Okeke" /></div>
                <div className="field"><label htmlFor="ap-email">Email</label><input className="input" type="email" id="ap-email" name="email" required placeholder="you@email.com" /></div>
                <div className="field"><label htmlFor="ap-city">City &amp; country</label><input className="input" type="text" id="ap-city" name="city" placeholder="Port Harcourt, Nigeria" /></div>
                <div className="field full">
                  <label>I&apos;m applying as a…</label>
                  <div className="role-pick">
                    {[{ v: "designer", l: "Designer" },{ v: "engineer", l: "Engineer" },{ v: "either", l: "Either / both" }].map((r) => (
                      <div key={r.v}>
                        <input type="radio" name="role" id={`r-${r.v}`} value={r.v} checked={role === r.v} onChange={() => setRole(r.v)} />
                        <label htmlFor={`r-${r.v}`}>{r.l}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field full"><label htmlFor="ap-url">Portfolio · GitHub · Dribbble</label><input className="input" type="url" id="ap-url" name="url" placeholder="https://" /></div>
                <div className="field full">
                  <label htmlFor="ap-why">Why do you want in? <span style={{ textTransform: "none", color: "var(--mute-2)", letterSpacing: 0 }}>(optional · 1–2 sentences)</span></label>
                  <textarea className="input" id="ap-why" name="why" placeholder="What pulls you to GSI? What's the last thing you shipped?" />
                </div>
              </div>
              <div className="form-submit-row">
                <div className="legal">By submitting you agree to receive Buildathon updates. Unsubscribe any time.</div>
                <button className="form-submit" type="submit">{formDone ? "Saved ✓" : <>Get notified <span className="mono">→</span></>}</button>
              </div>
              {formDone && (
                <div className="form-success show">
                  You&apos;re on the list. We&apos;ll email <strong style={{ marginLeft: 4 }}>{submittedEmail}</strong> the moment applications go live.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="section" id="who">
        <div className="wrap">
          <div className="section-head fade-up">
            <div className="eyebrow">Founding roles</div>
            <h2 className="display-2">Two roles. Founding equity.</h2>
            <p className="lede">Every applicant is also a candidate for our partner startups — over a dozen firms looking for elite builders from the South/East to fill product and engineering seats.</p>
          </div>
          <div className="who-grid">
            <div className="who-card fade-up">
              <div className="role-tag">Role 01 · Design</div>
              <h3>Founding<br /><em>Product Designer</em></h3>
              <ul>
                <li>Owns the visual + interaction system of GSI from day one.</li>
                <li>Comfortable in Figma, equally comfortable in code.</li>
                <li>Taste for restraint over dashboard clutter.</li>
                <li>Bonus: shipped to African or Global South audiences.</li>
              </ul>
              <div className="who-foot"><span>Based</span><strong>Hybrid · Port Harcourt</strong></div>
            </div>
            <div className="who-card fade-up d2">
              <div className="role-tag">Role 02 · Engineering</div>
              <h3>Founding<br /><em>Software Engineer</em></h3>
              <ul>
                <li>Full-stack, pragmatic, ships every week.</li>
                <li>Familiar with Web3 plumbing — obsessed with hiding it.</li>
                <li>Loves a calm, well-typed codebase. Reads OpenAlex docs for fun.</li>
                <li>Bonus: open-source maintainer or DeSci contributor.</li>
              </ul>
              <div className="who-foot"><span>Based</span><strong>Hybrid · Port Harcourt</strong></div>
            </div>
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
              <div className="rank">First place · The contract</div>
              <h4>Founding <em>team offer</em> + ₦TBD cash prize</h4>
              <div className="price">2 roles · live on stage</div>
              <p>One designer. One engineer. Hired into the GSI founding team with equity, a relocation stipend, and the chance to build the platform from the first commit.</p>
            </div>
            <div className="prize fade-up d2">
              <div className="rank">Second place</div>
              <h4>Talent Pipeline fast-track</h4>
              <div className="price">12+ partner startups</div>
              <p>Skip the line. Direct introductions, with portfolio context, to every hiring partner in our network.</p>
            </div>
            <div className="prize fade-up d3">
              <div className="rank">Third place</div>
              <h4>DeSci grant + mentorship</h4>
              <div className="price">Sponsored · Web3 partners</div>
              <p>Micro-grant from our Web3 sponsors, plus 3 months of mentorship from senior product and engineering leads.</p>
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
            <p className="lede">Final partner list publishes alongside applications on Jul 1. If you'd like to be on it — academic, community, startup or Web3 — we're listening.</p>
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
          <p>Applications open Jul 1, 2026. Three days to ship. Two founding jobs on the line. One stage in Port Harcourt.</p>
          <a className="btn btn-primary" href="#apply">Get notified <span className="arr">→</span></a>
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
                <li><a href="#prizes">Prizes</a></li>
                <li><a href="#faq">FAQ</a></li>
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
