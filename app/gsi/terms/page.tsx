"use client";

import React from "react";
import Link from "next/link";

export default function GsiTermsPage() {
  return (
    <div className="gsi-root">
      {/* NAV */}
      <nav className="gsi-nav">
        <div className="nav-inner">
          <Link className="brand" href="/gsi">
            <img
              src="/gsi-logo.png"
              alt="GSI Buildathon"
              className="brand-mark"
              width="120"
              height="48"
              style={{ objectFit: "contain", display: "block" }}
            />
          </Link>
          <div className="nav-links" style={{ display: "flex" }}>
            <Link href="/gsi">← Back to Buildathon</Link>
          </div>
          <a
            className="nav-cta"
            href="https://luma.com/97j679e0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "auto" }}
          >
            <span className="dot" style={{ background: "#e05638", boxShadow: "0 0 8px #e05638" }} />
            Register now
          </a>
        </div>
      </nav>

      {/* ARTICLE HEADER */}
      <header style={{
        background: "var(--bg-2)",
        borderBottom: "1px solid var(--line)",
        padding: "80px 0 60px",
      }}>
        <div className="wrap" style={{ maxWidth: "800px" }}>
          {/* Org Header */}
          <div style={{
            borderBottom: "2px solid var(--ink)",
            paddingBottom: "24px",
            marginBottom: "32px",
            fontSize: "13px",
            lineHeight: "1.6",
            color: "var(--mute)",
            display: "flex",
            flexDirection: "column",
            gap: "2px"
          }}>
            <strong style={{ color: "var(--ink)", fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Parakletus Hub Nigeria Ltd
            </strong>
            <span style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
              Private Company Limited by Shares
            </span>
            <span>No 10, Nna Atako Street, Port Harcourt, Rivers State, Nigeria.</span>
            <span>Tel No: +234 8148 876 125 &nbsp;|&nbsp; Email: parakletus70@gmail.com</span>
            <span>RC NO: 1909664</span>
          </div>

          <span className="eyebrow" style={{ marginBottom: "16px" }}>GSI Buildathon Vol. 01</span>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 44px)",
            lineHeight: "1.1",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            marginBottom: "20px"
          }}>
            Terms &amp; Conditions
          </h1>
          <p className="lede" style={{ fontSize: "18px", color: "var(--mute)", lineHeight: "1.5" }}>
            By applying for or participating in the Global South Index (GSI) Buildathon, you agree to the following Terms and Conditions:
          </p>
        </div>
      </header>

      {/* TERMS CONTENT */}
      <section className="section" style={{ padding: "60px 0 100px" }}>
        <div className="wrap" style={{ maxWidth: "800px" }}>
          <div className="terms-body" style={{
            display: "flex",
            flexDirection: "column",
            gap: "36px",
            fontSize: "15px",
            lineHeight: "1.65",
            color: "var(--ink-2)"
          }}>
            
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                1. Eligibility
              </h3>
              <p>
                The Buildathon is open to software engineers, product designers, and other eligible technology professionals who satisfy the application requirements. Participants must provide accurate and complete information during registration. The Organizer reserves the right to disqualify any applicant who provides false or misleading information.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                2. Selection Process
              </h3>
              <p style={{ marginBottom: "12px" }}>
                Applications are accepted on an individual basis only. However, selection will be based on both the applicant's individual competence and their ability to contribute effectively within a team. Participation in the Buildathon is competitive and selection is at the sole discretion of the Organizer. Applicants will be assessed based on, but not limited to:
              </p>
              <ul style={{
                paddingLeft: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                listStyleType: "disc"
              }}>
                <li>Individual technical competence and problem-solving ability;</li>
                <li>Portfolio, previous work or demonstrated experience;</li>
                <li>Communication and collaboration skills;</li>
                <li>Alignment with the objectives of the Buildathon.</li>
              </ul>
              <p style={{ marginTop: "12px" }}>
                Submission of an application does not guarantee selection. The Organizer's decision regarding participant selection shall be final.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                3. Attendance and Participation
              </h3>
              <p>
                Selected participants are expected to participate fully throughout the duration of the Buildathon. Repeated absence, inactivity or failure to contribute meaningfully may result in disqualification.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                4. Cash Prize &amp; Compensation
              </h3>
              <p>
                The cash prize awarded at the end of the Buildathon shall constitute full compensation for work carried out during the Buildathon. Participants shall not be entitled to any additional remuneration unless otherwise agreed in writing by the Organizer.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                5. Recruitment &amp; Post-Buildathon Engagement
              </h3>
              <p style={{ marginBottom: "12px" }}>
                The Buildathon serves as a recruitment exercise for the founding technical team of the Global South Index. Selection or participation does not guarantee employment or long-term engagement.
              </p>
              <p>
                Successful participants may be invited to subsequent interviews or engagement processes at the discretion of the Organizer and will get to work on the project for six (6) months.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                6. Evaluation
              </h3>
              <p style={{ marginBottom: "12px" }}>
                Projects and participants may be evaluated based on:
              </p>
              <ul style={{
                paddingLeft: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                listStyleType: "disc"
              }}>
                <li>Algorithms;</li>
                <li>Technical quality;</li>
                <li>Product design and user experience;</li>
                <li>Innovation;</li>
                <li>Scalability;</li>
                <li>Collaboration;</li>
                <li>Problem-solving approach;</li>
                <li>Presentation.</li>
              </ul>
              <p style={{ marginTop: "12px" }}>
                The evaluation criteria may be adjusted by the Organizer where necessary.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                7. Use of AI Tools
              </h3>
              <p>
                Participants may use artificial intelligence tools to support their work where appropriate. However, all submissions must reflect the participant's own contributions and understanding, and participants remain solely responsible for the originality, accuracy, and integrity of their work.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                8. Code of Conduct
              </h3>
              <p>
                Participants are expected to conduct themselves professionally and respectfully. Harassment, plagiarism, dishonesty, disruptive behaviour, or any conduct that undermines the integrity of the Buildathon may result in immediate disqualification.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                9. Intellectual Property and Confidentiality
              </h3>
              <p>
                All intellectual property, source code, designs, documentation, and other work products developed during the Buildathon for the Global South Index shall belong exclusively to Parakletus Hub Nigeria unless otherwise agreed in writing. Participants shall treat all non-public information relating to the Global South Index, Parakletus Hub Nigeria, and the Buildathon as confidential and shall not disclose or use such information outside the Buildathon without prior written consent.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                11. Organizer's Rights
              </h3>
              <p>
                The Organizer reserves the right to amend the Buildathon schedule, evaluation criteria, team composition, or these Terms and Conditions where reasonably necessary. The Organizer also reserves the right to suspend, postpone, or cancel the Buildathon if circumstances so require.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "var(--ink)" }}>
                12. Acceptance
              </h3>
              <p>
                By submitting an application or participating in the Global South Index (GSI) Buildathon, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <Link className="brand" href="/gsi">
                <img
                  src="/gsi-logo.png"
                  alt="GSI Buildathon"
                  className="brand-mark"
                  width="120"
                  height="48"
                  style={{ objectFit: "contain", display: "block" }}
                />
              </Link>
              <p>
                A community-owned scholarly index, built on open infrastructure,
                for researchers the rest of the world keeps overlooking.
              </p>
            </div>
            <div>
              <h5>Event</h5>
              <ul>
                <li>
                  <Link href="/gsi#about">About</Link>
                </li>
                <li>
                  <Link href="/gsi#challenge">Challenge</Link>
                </li>
                <li>
                  <Link href="/gsi#timeline">Timeline</Link>
                </li>
                <li>
                  <Link href="/gsi#roadmap">Roadmap</Link>
                </li>
                <li>
                  <Link href="/gsi#prizes">Prizes</Link>
                </li>
                <li>
                  <Link href="/gsi#faq">FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bot">
            <span>© 2026 Global South Index · Port Harcourt, Nigeria</span>
            <span>
              Code of Conduct · Privacy · <Link href="/gsi/terms" style={{ textDecoration: "underline" }}>Terms</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
