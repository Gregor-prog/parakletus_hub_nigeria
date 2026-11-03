/**
 * Admin credential check, backed by environment variables (no database yet).
 *
 *   ADMIN_USERNAME        plain username
 *   ADMIN_PASSWORD_HASH   scrypt hash made with `pnpm admin:hash`
 *
 * The password itself is never stored, so a leaked env file or build log does
 * not hand out the password. Format: scrypt:N:r:p:<salt b64url>:<key b64url>
 * (colons, not `$`, because Next's .env loader expands `$VAR`.)
 */
import { scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function scryptAsync(password: string, salt: Buffer, N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N, r, p, maxmem: 256 * N * r }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

// Same work for an unknown username as for a wrong password, so response time
// doesn't reveal which one was wrong.
const DUMMY_HASH = `scrypt:16384:8:1:${Buffer.alloc(16).toString("base64url")}:${Buffer.alloc(KEY_LENGTH).toString("base64url")}`;

async function verifyHash(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, keyB64] = parts;
  const N = Number(n), R = Number(r), P = Number(p);
  if (!Number.isInteger(N) || !Number.isInteger(R) || !Number.isInteger(P)) return false;
  const expected = Buffer.from(keyB64, "base64url");
  if (expected.length !== KEY_LENGTH) return false;
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64url"), N, R, P);
  return timingSafeEqual(actual, expected);
}

export function isAdminAuthConfigured(): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && secret.length >= 32);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const storedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!isAdminAuthConfigured()) return false;

  const a = Buffer.from(username);
  const b = Buffer.from(expectedUser);
  const userOk = a.length === b.length && timingSafeEqual(a, b);

  const passOk = await verifyHash(password, userOk ? storedHash : DUMMY_HASH).catch(() => false);
  return userOk && passOk;
}
