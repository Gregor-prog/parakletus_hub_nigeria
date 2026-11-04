"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ParaLearnSchools } from "@/lib/admin/console-api";
import { deleteSchool, setSchoolActive, type SchoolActionResult } from "./school-actions";

type School = ParaLearnSchools["schools"][number];
type Step = "view" | "deactivate" | "delete";

const NUM = new Intl.NumberFormat("en-NG");
const count = (n: number, one: string, many = `${one}s`) => `${NUM.format(n)} ${n === 1 ? one : many}`;
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric" });

export function SchoolsTable({ schools }: { schools: School[] }) {
  const [selected, setSelected] = useState<School | null>(null);
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
              <th scope="col">School</th>
              <th scope="col">Subdomain</th>
              <th scope="col">Status</th>
              <th scope="col" className="num">
                Students
              </th>
              <th scope="col" className="num">
                Teachers
              </th>
              <th scope="col" className="num">
                Classes
              </th>
              <th scope="col">Joined</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <tr key={s.id} onClick={() => setSelected(s)}>
                <th scope="row">
                  {/* The button makes each row reachable and operable by keyboard. */}
                  <button
                    type="button"
                    className="row-open"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(s);
                    }}
                  >
                    {s.name}
                  </button>
                </th>
                <td className="mono">{s.subdomain}</td>
                <td>
                  <span className={`check ${s.isActive ? "is-on" : "is-bad"}`}>{s.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="num">{NUM.format(s.students)}</td>
                <td className="num">{NUM.format(s.teachers)}</td>
                <td className="num">{NUM.format(s.classes)}</td>
                <td className="muted">{DATE.format(new Date(s.createdAt))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <SchoolModal
          key={selected.id}
          school={selected}
          onClose={() => setSelected(null)}
          onDone={(message, deleted) => {
            setNotice(message);
            if (deleted) setSelected(null);
          }}
        />
      )}
    </>
  );
}

function SchoolModal({
  school: initial,
  onClose,
  onDone,
}: {
  school: School;
  onClose: () => void;
  onDone: (message: string, deleted?: boolean) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [school, setSchool] = useState(initial);
  const [step, setStep] = useState<Step>("view");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const run = (action: () => Promise<SchoolActionResult>, after: (r: SchoolActionResult) => void) => {
    setError(null);
    start(async () => {
      const r = await action();
      if (!r.ok) return setError(r.message);
      after(r);
      router.refresh();
    });
  };

  const toggleActive = () =>
    run(
      () => setSchoolActive(school.id, !school.isActive),
      (r) => {
        setSchool({ ...school, isActive: !school.isActive });
        setStep("view");
        onDone(`${school.name}: ${r.message}`);
      },
    );

  const remove = () =>
    run(
      () => deleteSchool(school.id, confirmText),
      (r) => {
        ref.current?.close();
        onDone(`${school.name}: ${r.message}`, true);
      },
    );

  const confirmMatches = confirmText.trim().toLowerCase() === school.subdomain.toLowerCase();

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="school-modal-title"
      onClose={onClose}
      onCancel={(e) => pending && e.preventDefault()}
      onClick={(e) => e.target === ref.current && !pending && ref.current?.close()}
    >
      <div className="modal__body">
        <header className="modal__head">
          <div>
            <span className="card__code">ParaLearn school</span>
            <h2 id="school-modal-title" className="modal__title">
              {school.name}
            </h2>
            <p className="modal__sub mono">{school.subdomain}.pln.ng</p>
          </div>
          <button type="button" className="modal__x" onClick={() => ref.current?.close()} disabled={pending} aria-label="Close">
            ×
          </button>
        </header>

        <dl className="facts">
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`check ${school.isActive ? "is-on" : "is-bad"}`}>{school.isActive ? "Active" : "Inactive"}</span>
            </dd>
          </div>
          <div>
            <dt>Students</dt>
            <dd>{NUM.format(school.students)}</dd>
          </div>
          <div>
            <dt>Teachers</dt>
            <dd>{NUM.format(school.teachers)}</dd>
          </div>
          <div>
            <dt>Classes</dt>
            <dd>{NUM.format(school.classes)}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{DATE.format(new Date(school.createdAt))}</dd>
          </div>
        </dl>

        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}

        {/* ── Access ─────────────────────────────── */}
        <section className="action">
          <h3 className="action__title">{school.isActive ? "Deactivate school" : "Reactivate school"}</h3>
          <p className="action__desc">
            {school.isActive
              ? "Its admins, teachers, students and parents can't sign in or use ParaLearn until it's reactivated. Nothing is deleted."
              : "Restores access for everyone at this school straight away. All of its data is still here."}
          </p>
          {school.isActive && step === "deactivate" ? (
            <div className="action__confirm">
              <span className="action__ask">Deactivate {school.name} now?</span>
              <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setStep("view")} disabled={pending}>
                Cancel
              </button>
              <button type="button" className="adm-btn adm-btn--warn" onClick={toggleActive} disabled={pending}>
                {pending ? "Deactivating…" : "Yes, deactivate"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`adm-btn ${school.isActive ? "adm-btn--warn-ghost" : "adm-btn--primary"}`}
              onClick={() => (school.isActive ? setStep("deactivate") : toggleActive())}
              disabled={pending}
            >
              {school.isActive ? "Deactivate…" : pending ? "Reactivating…" : "Reactivate school"}
            </button>
          )}
        </section>

        {/* ── Delete ─────────────────────────────── */}
        <section className="action action--danger">
          <h3 className="action__title">Delete school permanently</h3>
          <p className="action__desc">
            Removes the school and <strong>all</strong> of its data:{" "}
            {`${count(school.students, "student")}, ${count(school.teachers, "teacher")}, ${count(school.classes, "class", "classes")},`}{" "}
            results, attendance, assessments and report cards. This can&apos;t be undone.
          </p>
          {school.isActive ? (
            <p className="action__note">Deactivate the school first. A live school can&apos;t be deleted.</p>
          ) : step === "delete" ? (
            <div className="action__type">
              <label className="field">
                <span className="field__label">
                  Type <strong className="mono">{school.subdomain}</strong> to confirm
                </span>
                <input
                  className="field__input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  disabled={pending}
                />
              </label>
              <div className="action__confirm">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setStep("view")} disabled={pending}>
                  Cancel
                </button>
                <button type="button" className="adm-btn adm-btn--danger" onClick={remove} disabled={!confirmMatches || pending}>
                  {pending ? "Deleting…" : "Delete permanently"}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="adm-btn adm-btn--danger-ghost" onClick={() => setStep("delete")} disabled={pending}>
              Delete…
            </button>
          )}
        </section>
      </div>
    </dialog>
  );
}
