/**
 * Admin credential check, backed by environment variables (no database yet).
 *
 *   ADMIN_USERNAME        username (matched case-insensitively)
 *   ADMIN_PASSWORD_HASH   either
 *                           scrypt:N:r:p:<salt b64url>:<key b64url>   from `pnpm admin:credentials`
 *                           $2a$/$2b$/$2y$ bcrypt hash                from any bcrypt tool
 *
 * The password itself is never stored, so a leaked env file or build log does
 * not hand out the password. The password is compared exactly (no trimming).
 */
import { scrypt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { adminUsername, normalizeUsername, readEnv, sessionSecret } from "./config";

const KEY_LENGTH = 64;
const BCRYPT = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export type HashFormat = "scrypt" | "bcrypt" | "unrecognized";

export function hashFormat(stored: string): HashFormat {
  if (stored.startsWith("scrypt:") && stored.split(":").length === 6) return "scrypt";
  if (BCRYPT.test(stored)) return "bcrypt";
  return "unrecognized";
}

function scryptAsync(password: string, salt: Buffer, N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N, r, p, maxmem: 256 * N * r }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

async function verifyScrypt(password: string, stored: string): Promise<boolean> {
  const [, n, r, p, saltB64, keyB64] = stored.split(":");
  const N = Number(n), R = Number(r), P = Number(p);
  if (!Number.isInteger(N) || !Number.isInteger(R) || !Number.isInteger(P)) return false;
  const expected = Buffer.from(keyB64, "base64url");
  if (expected.length !== KEY_LENGTH) return false;
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64url"), N, R, P);
  return timingSafeEqual(actual, expected);
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  switch (hashFormat(stored)) {
    case "scrypt":
      return verifyScrypt(password, stored);
    case "bcrypt":
      return bcrypt.compare(password, stored);
    default:
      return false;
  }
}

let warned = false;
/** Explains, once per server instance and without printing values, why sign-in can't work. */
function warnIfMisconfigured() {
  if (warned) return;
  const problems: string[] = [];
  if (!readEnv("ADMIN_USERNAME")) problems.push("ADMIN_USERNAME is empty");
  const hash = readEnv("ADMIN_PASSWORD_HASH");
  if (!hash) problems.push("ADMIN_PASSWORD_HASH is empty");
  else if (hashFormat(hash) === "unrecognized")
    problems.push("ADMIN_PASSWORD_HASH is not a scrypt (pnpm admin:credentials) or bcrypt ($2a$/$2b$) hash");
  if (!sessionSecret()) problems.push("ADMIN_SESSION_SECRET is missing or shorter than 32 characters");
  if (problems.length) {
    warned = true;
    console.warn(`[admin] Sign-in can't succeed: ${problems.join("; ")}.`);
  }
}

export function isAdminAuthConfigured(): boolean {
  warnIfMisconfigured();
  return Boolean(adminUsername() && readEnv("ADMIN_PASSWORD_HASH") && sessionSecret());
}

/** Returns the canonical username on success, or null. */
export async function verifyAdminCredentials(username: string, password: string): Promise<string | null> {
  if (!isAdminAuthConfigured()) return null;
  const expectedUser = adminUsername();
  const storedHash = readEnv("ADMIN_PASSWORD_HASH");

  const a = Buffer.from(normalizeUsername(username));
  const b = Buffer.from(expectedUser);
  const userOk = a.length === b.length && timingSafeEqual(a, b);

  // Always hash, even for a wrong username, so timing doesn't reveal which part was wrong.
  const passOk = await verifyPassword(password, storedHash).catch(() => false);
  return userOk && passOk ? expectedUser : null;
}
