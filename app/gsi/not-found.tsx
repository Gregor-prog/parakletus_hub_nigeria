import Link from "next/link";

export default function GsiNotFound() {
  return (
    <div className="gsi-root gsi-404">
      <div className="gsi-404__wrap">
        <span className="gsi-404__num" aria-hidden="true">404</span>
        <h1 className="gsi-404__title">This page doesn&rsquo;t exist yet.</h1>
        <p className="gsi-404__sub">But here&rsquo;s something that does.</p>

        <div className="gsi-404__vol">
          <div className="gsi-404__vol-eyebrow">
            <span className="gsi-404__dot" />
            <span>Global South Index &middot; Community</span>
          </div>
          <h2 className="gsi-404__vol-title">Help build the Global South Index.</h2>
          <p className="gsi-404__vol-body">
            GSI is a community-owned academic indexing platform giving African and Global South
            researchers the recognition, reach, and permanence their work deserves. We&rsquo;re
            looking for beta testers, data curators, and institution advocates — no engineering
            background required.
          </p>
          <div className="gsi-404__vol-actions">
            <a href="mailto:volunteer@globalsouthindex.org" className="gsi-404__vol-cta">
              Become a volunteer →
            </a>
            <Link href="/gsi" className="gsi-404__vol-learn">
              Back to GSI Buildathon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
