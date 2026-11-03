"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="form" noValidate>
      <input type="hidden" name="next" value={next} />

      <label className="field">
        <span className="field__label">Username</span>
        <input
          className="field__input"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          autoFocus
        />
      </label>

      <label className="field">
        <span className="field__label">Password</span>
        <span className="field__wrap">
          <input
            className="field__input"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
          >
            {show ? "Hide" : "Show"}
          </button>
        </span>
      </label>

      {state?.error && (
        <p className="form__error" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
        {!pending && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
