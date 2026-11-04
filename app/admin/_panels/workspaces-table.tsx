"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CbtWorkspaces } from "@/lib/admin/console-api";
import { deleteWorkspace } from "./school-actions";

type Workspace = CbtWorkspaces["workspaces"][number];

const NUM = new Intl.NumberFormat("en-NG");
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric" });
const count = (n: number, one: string, many = `${one}s`) => `${NUM.format(n)} ${n === 1 ? one : many}`;
const typeLabel = (t: Workspace["type"]) => (t === "INSTITUTION" ? "School" : "Exam hall");

export function WorkspacesTable({ workspaces }: { workspaces: Workspace[] }) {
  const [selected, setSelected] = useState<Workspace | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <>
      {notice && (
        <p className="toast" role="status">
          {notice}
          <button type="button" className="toast__close" onClick={() => setNotice(null)} aria-label="Dismiss">
            ×
          </button>
        </p>
      )}
      <div className="table-wrap">
        <table className="table table--clickable">
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
            {workspaces.map((w) => (
              <tr key={w.id} onClick={() => setSelected(w)}>
                <th scope="row">
                  <button
                    type="button"
                    className="row-open"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(w);
                    }}
                  >
                    {w.name}
                  </button>
                </th>
                <td>{typeLabel(w.type)}</td>
                <td className="muted">{w.ownerName ?? "—"}</td>
                <td className="num">{NUM.format(w.exams)}</td>
                <td className="num">{NUM.format(w.questions)}</td>
                <td className="num">{NUM.format(w.credits)}</td>
                <td className="muted">{DATE.format(new Date(w.createdAt))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <WorkspaceModal
          key={selected.id}
          workspace={selected}
          onClose={() => setSelected(null)}
          onDeleted={(message) => {
            setNotice(message);
            setSelected(null);
          }}
        />
      )}
    </>
  );
}

function WorkspaceModal({
  workspace: w,
  onClose,
  onDeleted,
}: {
  workspace: Workspace;
  onClose: () => void;
  onDeleted: (message: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const matches = confirmText.trim().toLowerCase() === w.name.trim().toLowerCase();

  const remove = () => {
    setError(null);
    start(async () => {
      const r = await deleteWorkspace(w.id, confirmText);
      if (!r.ok) return setError(r.message);
      ref.current?.close();
      onDeleted(`${w.name}: ${r.message}`);
      router.refresh();
    });
  };

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="ws-modal-title"
      onClose={onClose}
      onCancel={(e) => pending && e.preventDefault()}
      onClick={(e) => e.target === ref.current && !pending && ref.current?.close()}
    >
      <div className="modal__body">
        <header className="modal__head">
          <div>
            <span className="card__code">ParaLearn CBT workspace</span>
            <h2 id="ws-modal-title" className="modal__title">
              {w.name}
            </h2>
            <p className="modal__sub">
              {typeLabel(w.type)}
              {w.ownerName ? ` · ${w.ownerName}` : ""}
            </p>
          </div>
          <button type="button" className="modal__x" onClick={() => ref.current?.close()} disabled={pending} aria-label="Close">
            ×
          </button>
        </header>

        <dl className="facts">
          <div>
            <dt>Exams</dt>
            <dd>{NUM.format(w.exams)}</dd>
          </div>
          <div>
            <dt>Questions</dt>
            <dd>{NUM.format(w.questions)}</dd>
          </div>
          <div>
            <dt>Credits</dt>
            <dd>{NUM.format(w.credits)}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{DATE.format(new Date(w.createdAt))}</dd>
          </div>
        </dl>

        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}

        <section className="action action--danger">
          <h3 className="action__title">Delete workspace permanently</h3>
          <p className="action__desc">
            Removes the workspace and <strong>all</strong> of its data:{" "}
            {`${count(w.exams, "exam")}, ${count(w.questions, "question")}, every candidate roster, attempt, answer and score.`}
            This can&apos;t be undone.
          </p>
          {w.type === "INSTITUTION" && (
            <p className="action__note">
              This is a school&apos;s ParaLearn CBT workspace. CBT scores that haven&apos;t been sent to report cards will be
              lost.
            </p>
          )}
          <p className="action__note">It can&apos;t be deleted while anyone is sitting one of its exams.</p>
          {confirming ? (
            <div className="action__type">
              <label className="field">
                <span className="field__label">
                  Type <strong>{w.name}</strong> to confirm
                </span>
                <input
                  className="field__input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  disabled={pending}
                />
              </label>
              <div className="action__confirm">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirming(false)} disabled={pending}>
                  Cancel
                </button>
                <button type="button" className="adm-btn adm-btn--danger" onClick={remove} disabled={!matches || pending}>
                  {pending ? "Deleting…" : "Delete permanently"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="adm-btn adm-btn--danger-ghost"
              onClick={() => setConfirming(true)}
              disabled={pending}
            >
              Delete…
            </button>
          )}
        </section>
      </div>
    </dialog>
  );
}
