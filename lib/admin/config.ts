/**
 * Reads the admin console's settings from the environment, forgiving the
 * common ways a value gets mangled when pasted into a hosting dashboard:
 * surrounding whitespace or newlines, wrapping quotes, or the whole
 * `NAME=value` line pasted as the value.
 *
 * Every admin module reads settings through here, so sign-in and session
 * checks always agree on the same values.
 */

export function readEnv(name: string): string {
  let v = (process.env[name] ?? "").trim();
  if (v.startsWith(`${name}=`)) v = v.slice(name.length + 1).trim();
  if (v.length >= 2 && (v[0] === '"' || v[0] === "'") && v.at(-1) === v[0]) v = v.slice(1, -1).trim();
  return v;
}

/** Usernames are matched case-insensitively; this is the canonical form. */
export function normalizeUsername(u: string): string {
  return u.trim().normalize("NFC").toLowerCase();
}

export function adminUsername(): string {
  return normalizeUsername(readEnv("ADMIN_USERNAME"));
}

export function sessionSecret(): string | null {
  const s = readEnv("ADMIN_SESSION_SECRET");
  return s.length >= 32 ? s : null;
}
