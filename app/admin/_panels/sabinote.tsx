import { consoleGet, type SabiNoteSummary, type SabiNoteTransactions, type SabiNoteUsers } from "@/lib/admin/console-api";
import { Empty, Pager, PanelError, SearchBox, Tiles, Updated, fmt, fmtDate, fmtDateTime } from "./shared";
import type { PanelProps } from "./types";

const SOURCE_LABEL = { paystack: "Paystack", manual: "Free (manual)", admin: "Admin credit" } as const;

export async function SabiNoteOverview() {
  const res = await consoleGet<SabiNoteSummary>("sabinote", "api", "/console/summary");
  if (!res.ok) {
    return (
      <section>
        <PanelError result={res} what="SabiNote" />
      </section>
    );
  }
  const s = res.data;
  const t = s.topups30d;

  return (
    <>
      <section aria-labelledby="sn-use-h">
        <h2 id="sn-use-h" className="block-title">
          Educators &amp; usage
        </h2>
        <Tiles
          tiles={[
            { label: "Educators", value: s.users.total, note: `${fmt(s.users.verified)} verified`, tone: "ink" },
            { label: "New educators", value: s.users.new30d, note: "last 30 days" },
            { label: "Lesson notes", value: s.lessonNotes.total, note: "all time" },
            { label: "Notes generated", value: s.lessonNotes.last30d, note: "last 30 days" },
          ]}
        />
      </section>

      <section aria-labelledby="sn-top-h">
        <h2 id="sn-top-h" className="block-title">
          Top-ups, last 30 days
        </h2>
        <Tiles
          tiles={[
            { label: "Paid via Paystack", value: t.paystack.count, note: `${fmt(t.paystack.parats)} Parats` },
            {
              label: "Free manual top-ups",
              value: t.manual.count,
              note: `${fmt(t.manual.parats)} Parats given free`,
              tone: t.manual.count > 0 ? "alert" : undefined,
            },
            { label: "Admin credits", value: t.admin.count, note: `${fmt(t.admin.parats)} Parats` },
            {
              label: "Failed transactions",
              value: s.failedTransactions30d,
              tone: s.failedTransactions30d > 0 ? "alert" : undefined,
            },
          ]}
        />
        <Updated iso={s.generatedAt} />
      </section>
    </>
  );
}

export async function SabiNoteUsersView({ base, page, q }: PanelProps) {
  const qs = new URLSearchParams({ page: String(page), limit: "25" });
  if (q) qs.set("search", q);
  const res = await consoleGet<SabiNoteUsers>("sabinote", "api", `/console/users?${qs}`);

  return (
    <section aria-label="Educators">
      <SearchBox base={base} tab="users" q={q} placeholder="Search by name or email" />
      {!res.ok ? (
        <PanelError result={res} what="educators" />
      ) : res.data.users.length === 0 ? (
        <Empty>{q ? `No educators match “${q}”.` : "No educators yet."}</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">State</th>
                  <th scope="col">Verified</th>
                  <th scope="col" className="num">
                    Notes
                  </th>
                  <th scope="col" className="num">
                    Balance
                  </th>
                  <th scope="col">Joined</th>
                </tr>
              </thead>
              <tbody>
                {res.data.users.map((u) => (
                  <tr key={u.userId}>
                    <th scope="row">
                      {u.firstName} {u.lastName}
                      {u.role === "admin" && <span className="role-tag">Admin</span>}
                    </th>
                    <td className="mono">{u.email}</td>
                    <td>{u.state}</td>
                    <td>
                      <span className={`check ${u.isVerified ? "is-on" : ""}`}>{u.isVerified ? "Yes" : "No"}</span>
                    </td>
                    <td className="num">{fmt(u.lessonNotes)}</td>
                    <td className="num">{fmt(u.balance)}</td>
                    <td className="muted">{fmtDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager base={base} tab="users" q={q} noun="educator" {...res.data.pagination} />
        </>
      )}
    </section>
  );
}

export async function SabiNoteTransactionsView({ base, page }: PanelProps) {
  const res = await consoleGet<SabiNoteTransactions>("sabinote", "api", `/console/transactions?page=${page}&limit=25`);

  return (
    <section aria-label="Transactions">
      {!res.ok ? (
        <PanelError result={res} what="transactions" />
      ) : res.data.transactions.length === 0 ? (
        <Empty>No transactions yet.</Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Educator</th>
                  <th scope="col">What</th>
                  <th scope="col">Source</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="num">
                    Parats
                  </th>
                </tr>
              </thead>
              <tbody>
                {res.data.transactions.map((t) => (
                  <tr key={t.transactionId}>
                    <td className="muted">{fmtDateTime(t.createdAt)}</td>
                    <th scope="row">
                      {t.user.firstName} {t.user.lastName}
                      <span className="sub mono">{t.user.email}</span>
                    </th>
                    <td>{(t.purpose ?? t.type).replaceAll("_", " ")}</td>
                    <td>
                      {t.source ? (
                        <span className={`src src--${t.source}`}>{SOURCE_LABEL[t.source]}</span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`check ${t.status === "success" ? "is-on" : t.status === "failed" ? "is-bad" : ""}`}>
                        {t.status === "success" ? "Success" : t.status === "failed" ? "Failed" : "Pending"}
                      </span>
                    </td>
                    <td className={`num ${t.amount < 0 ? "neg" : "pos"}`}>
                      {t.amount > 0 ? "+" : ""}
                      {fmt(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager base={base} tab="transactions" noun="transaction" {...res.data.pagination} />
        </>
      )}
    </section>
  );
}
