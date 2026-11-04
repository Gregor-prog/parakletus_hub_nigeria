import { consoleGet, type IjsdsSubmissions, type IjsdsSummary } from "@/lib/admin/console-api";
import { Empty, FilterChips, Pager, PanelError, Tiles, Updated, fmt, fmtDate } from "./shared";
import type { PanelProps } from "./types";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  revision_requested: "Revision requested",
  accepted: "Accepted",
  rejected: "Rejected",
};

const NAIRA = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
// Tiles are narrow; ₦315,000 reads as ₦315K there, with the exact figure in the note.
const NAIRA_SHORT = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", notation: "compact", maximumFractionDigits: 1 });

export async function IjsdsOverview() {
  const res = await consoleGet<IjsdsSummary>("ijsds", "api", "/console/summary");
  if (!res.ok) {
    return (
      <section>
        <PanelError result={res} what="IJSDS" />
      </section>
    );
  }
  const s = res.data;
  const by = s.submissions.byStatus;
  const inPipeline = Object.entries(s.ijsds2.manuscriptsByState)
    .filter(([state]) => state !== "PUBLISHED" && state !== "AUDIT_REJECTED")
    .reduce((n, [, c]) => n + c, 0);

  return (
    <>
      <section aria-labelledby="ij-pipe-h">
        <h2 id="ij-pipe-h" className="block-title">
          Editorial pipeline
        </h2>
        <Tiles
          tiles={[
            { label: "New submissions", value: s.submissions.last30d, note: "last 30 days", tone: "ink" },
            { label: "Awaiting triage", value: by.submitted ?? 0 },
            { label: "Under review", value: by.under_review ?? 0 },
            { label: "Revision requested", value: by.revision_requested ?? 0 },
            { label: "Accepted", value: by.accepted ?? 0, note: `${fmt(by.rejected ?? 0)} rejected` },
          ]}
        />
      </section>

      <section aria-labelledby="ij-rev-h">
        <h2 id="ij-rev-h" className="block-title">
          Peer review
        </h2>
        <Tiles
          tiles={[
            {
              label: "Overdue reviews",
              value: s.reviews.overdue,
              note: "past deadline",
              tone: s.reviews.overdue > 0 ? "alert" : undefined,
            },
            { label: "Reviews in progress", value: s.reviews.inProgress },
            { label: "Invitations pending", value: s.reviews.awaitingResponse },
            { label: "Reviews returned", value: s.reviews.submitted30d, note: "last 30 days" },
            {
              label: "Reviewer applications",
              value: s.people.reviewerApplicationsPending,
              note: "awaiting a decision",
              tone: s.people.reviewerApplicationsPending > 0 ? "alert" : undefined,
            },
          ]}
        />
      </section>

      <section aria-labelledby="ij-pub-h">
        <h2 id="ij-pub-h" className="block-title">
          Publishing &amp; indexing
        </h2>
        <Tiles
          tiles={[
            {
              label: "Published articles",
              value: s.articles.published,
              note: `${fmt(s.articles.published30d)} in the last 30 days`,
              tone: "ink",
            },
            { label: "Crossref registered", value: s.articles.crossref.registered },
            { label: "Crossref pending", value: s.articles.crossref.pending },
            {
              label: "Crossref failed",
              value: s.articles.crossref.failed,
              tone: s.articles.crossref.failed > 0 ? "alert" : undefined,
            },
            { label: "No DOI deposit", value: s.articles.crossref.notDeposited, note: "published, never deposited" },
          ]}
        />
      </section>

      <section aria-labelledby="ij-two-h">
        <h2 id="ij-two-h" className="block-title">
          IJSDS 2.0 &amp; people
        </h2>
        <Tiles
          tiles={[
            {
              label: "Payments received",
              value: NAIRA_SHORT.format(s.ijsds2.payments30d.naira),
              note: `${NAIRA.format(s.ijsds2.payments30d.naira)} · ${fmt(s.ijsds2.payments30d.count)} payments · 30 days`,
            },
            {
              label: "Payments to check",
              value: s.ijsds2.paymentsNeedingReview,
              note: "flagged for review",
              tone: s.ijsds2.paymentsNeedingReview > 0 ? "alert" : undefined,
            },
            { label: "2.0 manuscripts in progress", value: inPipeline },
            { label: "Authors", value: s.people.authors },
            { label: "Reviewers · editors", value: `${fmt(s.people.reviewers)} · ${fmt(s.people.editors)}` },
          ]}
        />
        <Updated iso={s.generatedAt} />
      </section>
    </>
  );
}

export async function IjsdsSubmissionsView({ base, page, status }: PanelProps) {
  const qs = new URLSearchParams({ page: String(page), limit: "25" });
  if (status && STATUS_LABEL[status]) qs.set("status", status);
  const res = await consoleGet<IjsdsSubmissions>("ijsds", "api", `/console/submissions?${qs}`);

  return (
    <section aria-label="Submissions">
      <FilterChips
        base={base}
        tab="submissions"
        current={status}
        options={[{ label: "All" }, ...Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))]}
      />
      {!res.ok ? (
        <PanelError result={res} what="submissions" />
      ) : res.data.submissions.length === 0 ? (
        <Empty>{status ? `No submissions are ${STATUS_LABEL[status]?.toLowerCase()}.` : "No submissions yet."}</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Manuscript</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="num">
                    Reviews
                  </th>
                  <th scope="col">Submitted</th>
                  <th scope="col">Last update</th>
                </tr>
              </thead>
              <tbody>
                {res.data.submissions.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className="wrap">
                      {s.title ?? <span className="muted">Untitled</span>}
                      <span className="sub">
                        {s.author ?? "Unknown author"}
                        {s.affiliation ? ` · ${s.affiliation}` : ""}
                      </span>
                    </th>
                    <td>
                      <span className={`status status--${s.status}`}>{STATUS_LABEL[s.status] ?? s.status}</span>
                    </td>
                    <td className="num">
                      {s.reviews.submitted}/{s.reviews.total}
                      {s.reviews.overdue > 0 && <span className="overdue">{s.reviews.overdue} overdue</span>}
                    </td>
                    <td className="muted">{fmtDate(s.submitted_at)}</td>
                    <td className="muted">{fmtDate(s.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager base={base} tab="submissions" status={status} noun="submission" {...res.data.pagination} />
        </>
      )}
    </section>
  );
}
