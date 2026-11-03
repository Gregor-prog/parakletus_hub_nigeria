/**
 * Failed-login throttle: 5 failures per IP per 15 minutes.
 *
 * In-memory, so it is per server instance. That is sufficient on a single VPS /
 * container; on serverless or multi-instance hosting, back this with Redis
 * (e.g. Upstash, already used by ParaLearn) before relying on it.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type Entry = { count: number; resetAt: number };
const failures = new Map<string, Entry>();

function sweep(now: number) {
  if (failures.size < 1000) return;
  for (const [key, e] of failures) if (e.resetAt <= now) failures.delete(key);
}

export function loginBlockedFor(ip: string): number {
  const e = failures.get(ip);
  const now = Date.now();
  if (!e || e.resetAt <= now) return 0;
  return e.count >= MAX_FAILURES ? Math.ceil((e.resetAt - now) / 1000) : 0;
}

export function recordLoginFailure(ip: string) {
  const now = Date.now();
  sweep(now);
  const e = failures.get(ip);
  if (!e || e.resetAt <= now) failures.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else e.count += 1;
}

export function clearLoginFailures(ip: string) {
  failures.delete(ip);
}
