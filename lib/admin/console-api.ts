/**
 * Typed reads from each backend's read-only /console/* API (server only).
 * Every call resolves to a result rather than throwing, so one slow or
 * misconfigured backend never breaks the page around it.
 */
import { getProduct } from "./products";
import { serviceBaseUrl, serviceFetch } from "./backends";

export type ConsoleResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unconfigured" | "no-token" | "unauthorized" | "disabled" | "unreachable" | "error"; message: string };

export async function consoleGet<T>(product: string, service: string, path: string): Promise<ConsoleResult<T>> {
  const svc = getProduct(product)?.services.find((s) => s.key === service);
  if (!svc || !serviceBaseUrl(svc)) {
    return { ok: false, reason: "unconfigured", message: `Set ${svc?.envPrefix ?? "the"}_API_URL to load this.` };
  }
  if (!process.env[`${svc.envPrefix}_API_TOKEN`]) {
    return { ok: false, reason: "no-token", message: `Set ${svc.envPrefix}_API_TOKEN to the backend's ADMIN_CONSOLE_TOKEN.` };
  }

  let res: Response;
  try {
    res = await serviceFetch(product, service, path, { method: "GET", timeoutMs: 12000 });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return { ok: false, reason: "unreachable", message: timedOut ? "The backend didn't answer in 12 seconds." : "Couldn't reach the backend." };
  }

  if (res.status === 401) {
    return { ok: false, reason: "unauthorized", message: `The backend rejected the token. Check ${svc.envPrefix}_API_TOKEN matches its ADMIN_CONSOLE_TOKEN.` };
  }
  if (res.status === 503) {
    return { ok: false, reason: "disabled", message: "The backend's ADMIN_CONSOLE_TOKEN isn't set, so its console API is off." };
  }
  if (res.status === 404) {
    return { ok: false, reason: "error", message: "This backend doesn't have the console API yet. Deploy the feat/console-api branch." };
  }
  if (!res.ok) return { ok: false, reason: "error", message: `The backend answered HTTP ${res.status}.` };

  try {
    const body = await res.json();
    // SabiNote wraps responses as { success, data }; the others return the payload directly.
    const data = body && typeof body === "object" && "success" in body && "data" in body ? body.data : body;
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, reason: "error", message: "The backend sent a response that isn't JSON." };
  }
}

type Page = { page: number; limit: number; total: number; totalPages: number };

export type ParaLearnSummary = {
  schools: { total: number; active: number; inactive: number; new30d: number };
  users: { total: number; students: number; teachers: number; admins: number; new30d: number };
  assessments: { total: number; published: number };
  reportCards: { total: number; published30d: number };
  generatedAt: string;
};
export type ParaLearnSchools = {
  schools: {
    id: string;
    name: string;
    subdomain: string;
    isActive: boolean;
    createdAt: string;
    classes: number;
    students: number;
    teachers: number;
  }[];
  pagination: Page;
};

export type CbtSummary = {
  workspaces: { total: number; institutions: number; standalone: number };
  exams: { total: number; published: number; liveNow: number };
  questions: number;
  candidates: number;
  attempts: { inProgress: number; submitted24h: number; disqualified30d: number };
  generatedAt: string;
};
export type CbtWorkspaces = {
  workspaces: {
    id: string;
    name: string;
    type: "INSTITUTION" | "STANDALONE_HALL";
    ownerName: string | null;
    credits: number;
    createdAt: string;
    exams: number;
    questions: number;
  }[];
  pagination: Page;
};

type TopupBucket = { count: number; parats: number };
export type SabiNoteSummary = {
  users: { total: number; verified: number; new30d: number };
  lessonNotes: { total: number; last30d: number };
  topups30d: { paystack: TopupBucket; manual: TopupBucket; admin: TopupBucket };
  failedTransactions30d: number;
  generatedAt: string;
};
export type SabiNoteUsers = {
  users: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    state: string;
    role: "teacher" | "admin";
    isVerified: boolean;
    createdAt: string;
    balance: number;
    lessonNotes: number;
  }[];
  pagination: Page;
};
export type SabiNoteTransactions = {
  transactions: {
    transactionId: string;
    type: "credit" | "debit";
    purpose: string | null;
    status: "pending" | "success" | "failed";
    amount: number;
    source: "paystack" | "manual" | "admin" | null;
    createdAt: string;
    user: { email: string; firstName: string; lastName: string };
  }[];
  pagination: Page;
};
