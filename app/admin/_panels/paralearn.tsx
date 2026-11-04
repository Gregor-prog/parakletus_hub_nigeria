import {
  consoleGet,
  type CbtSummary,
  type CbtWorkspaces,
  type ParaLearnSchools,
  type ParaLearnSummary,
} from "@/lib/admin/console-api";
import { Empty, Pager, PanelError, SearchBox, Tiles, Updated, fmt, fmtDate, type Tile } from "./shared";
import type { PanelProps } from "./types";
import { SchoolsTable } from "./schools-table";

export async function ParaLearnOverview() {
  const [core, cbt] = await Promise.all([
    consoleGet<ParaLearnSummary>("paralearn", "core", "/console/summary"),
    consoleGet<CbtSummary>("paralearn", "cbt", "/console/summary"),
  ]);

  return (
    <>
      <section aria-labelledby="pl-core-h">
        <h2 id="pl-core-h" className="block-title">
          Schools &amp; people
        </h2>
        {core.ok ? (
          <>
            <Tiles
              tiles={[
                {
                  label: "Schools",
                  value: core.data.schools.total,
                  note: `${fmt(core.data.schools.active)} active · ${fmt(core.data.schools.inactive)} inactive`,
                  tone: "ink",
                },
                { label: "New schools", value: core.data.schools.new30d, note: "last 30 days" },
                { label: "Students", value: core.data.users.students },
                { label: "Teachers", value: core.data.users.teachers },
                { label: "New users", value: core.data.users.new30d, note: "last 30 days" },
              ]}
            />
            <Tiles
              tiles={[
                {
                  label: "Assessments",
                  value: core.data.assessments.total,
                  note: `${fmt(core.data.assessments.published)} published`,
                },
                { label: "Report cards", value: core.data.reportCards.total, note: "all time" },
                { label: "Report cards published", value: core.data.reportCards.published30d, note: "last 30 days" },
              ]}
            />
            <Updated iso={core.data.generatedAt} />
          </>
        ) : (
          <PanelError result={core} what="ParaLearn core" />
        )}
      </section>

      <section aria-labelledby="pl-cbt-h">
        <h2 id="pl-cbt-h" className="block-title">
          CBT right now
        </h2>
        {cbt.ok ? <CbtTiles s={cbt.data} /> : <PanelError result={cbt} what="the CBT service" />}
      </section>
    </>
  );
}

function CbtTiles({ s }: { s: CbtSummary }) {
  const tiles: Tile[] = [
    {
      label: "Exams live now",
      value: s.exams.liveNow,
      note: `${fmt(s.exams.published)} published of ${fmt(s.exams.total)}`,
      tone: "ink",
    },
    { label: "Attempts in progress", value: s.attempts.inProgress },
    { label: "Submitted", value: s.attempts.submitted24h, note: "last 24 hours" },
    {
      label: "Disqualified",
      value: s.attempts.disqualified30d,
      note: "last 30 days",
      tone: s.attempts.disqualified30d > 0 ? "alert" : undefined,
    },
    {
      label: "Workspaces",
      value: s.workspaces.total,
      note: `${fmt(s.workspaces.institutions)} schools · ${fmt(s.workspaces.standalone)} halls`,
    },
  ];
  return (
    <>
      <Tiles tiles={tiles} />
      <Updated iso={s.generatedAt} />
    </>
  );
}

export async function ParaLearnSchoolsView({ base, page, q }: PanelProps) {
  const qs = new URLSearchParams({ page: String(page), limit: "25" });
  if (q) qs.set("search", q);
  const res = await consoleGet<ParaLearnSchools>("paralearn", "core", `/console/schools?${qs}`);

  return (
    <section aria-label="Schools">
      <SearchBox base={base} tab="schools" q={q} placeholder="Search by name or subdomain" />
      {!res.ok ? (
        <PanelError result={res} what="schools" />
      ) : res.data.schools.length === 0 ? (
        <Empty>{q ? `No schools match “${q}”.` : "No schools yet."}</Empty>
      ) : (
        <>
          <SchoolsTable schools={res.data.schools} />
          <Pager base={base} tab="schools" q={q} noun="school" {...res.data.pagination} />
        </>
      )}
    </section>
  );
}

export async function ParaLearnCbtView({ base, page }: PanelProps) {
  const [summary, list] = await Promise.all([
    consoleGet<CbtSummary>("paralearn", "cbt", "/console/summary"),
    consoleGet<CbtWorkspaces>("paralearn", "cbt", `/console/workspaces?page=${page}&limit=25`),
  ]);

  return (
    <>
      <section aria-labelledby="cbt-now-h">
        <h2 id="cbt-now-h" className="block-title">
          Right now
        </h2>
        {summary.ok ? (
          <>
            <CbtTiles s={summary.data} />
            <Tiles
              tiles={[
                { label: "Question bank", value: summary.data.questions },
                { label: "Candidates", value: summary.data.candidates, note: "all rosters" },
              ]}
            />
          </>
        ) : (
          <PanelError result={summary} what="the CBT service" />
        )}
      </section>

      <section aria-labelledby="cbt-ws-h">
        <h2 id="cbt-ws-h" className="block-title">
          Workspaces
        </h2>
        {!list.ok ? (
          <PanelError result={list} what="workspaces" />
        ) : list.data.workspaces.length === 0 ? (
          <Empty>No workspaces yet.</Empty>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Workspace</th>
                    <th scope="col">Type</th>
                    <th scope="col">Owner</th>
                    <th scope="col" className="num">
                      Exams
                    </th>
                    <th scope="col" className="num">
                      Questions
                    </th>
                    <th scope="col" className="num">
                      Credits
                    </th>
                    <th scope="col">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.workspaces.map((w) => (
                    <tr key={w.id}>
                      <th scope="row">{w.name}</th>
                      <td>{w.type === "INSTITUTION" ? "School" : "Exam hall"}</td>
                      <td className="muted">{w.ownerName ?? "—"}</td>
                      <td className="num">{fmt(w.exams)}</td>
                      <td className="num">{fmt(w.questions)}</td>
                      <td className="num">{fmt(w.credits)}</td>
                      <td className="muted">{fmtDate(w.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager base={base} tab="cbt" noun="workspace" {...list.data.pagination} />
          </>
        )}
      </section>
    </>
  );
}
