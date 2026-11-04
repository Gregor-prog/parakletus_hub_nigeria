"use server";

/**
 * School actions for the ParaLearn Schools tab. Server actions: Next rejects
 * cross-origin calls, each action re-checks the admin session, and the backend
 * token never leaves the server. The backend re-validates everything and
 * writes the audit log.
 */
import { requireSession } from "@/lib/admin/dal";
import { serviceFetch } from "@/lib/admin/backends";

export type SchoolActionResult = { ok: true; message: string } | { ok: false; message: string };

const SCHOOL_ID = /^[A-Za-z0-9_-]{8,64}$/;

async function call(path: string, body: unknown, actor: string): Promise<SchoolActionResult> {
  let res: Response;
  try {
    res = await serviceFetch("paralearn", "core", path, {
      method: "POST",
      headers: { "content-type": "application/json", "x-console-actor": actor },
      body: JSON.stringify(body),
      timeoutMs: 45000, // deletion runs a large transaction
    });
  } catch {
    return { ok: false, message: "Couldn't reach ParaLearn. Nothing was changed." };
  }

  let data: { message?: string | string[] } = {};
  try {
    data = await res.json();
  } catch {}
  const backendMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;

  if (res.ok) return { ok: true, message: "" };
  if (res.status === 401 || res.status === 503) {
    return { ok: false, message: "The console isn't connected to ParaLearn (check PARALEARN_API_TOKEN). Nothing was changed." };
  }
  if (res.status === 404 && (!backendMessage || /^Cannot (POST|GET)/.test(backendMessage))) {
    return { ok: false, message: "ParaLearn doesn't support this action yet. Deploy the latest core backend." };
  }
  return { ok: false, message: backendMessage || `ParaLearn answered HTTP ${res.status}.` };
}

export async function setSchoolActive(id: string, active: boolean): Promise<SchoolActionResult> {
  const session = await requireSession();
  if (!SCHOOL_ID.test(id) || typeof active !== "boolean") return { ok: false, message: "Invalid request." };
  const r = await call(`/console/schools/${id}/status`, { active }, session.sub);
  return r.ok ? { ok: true, message: active ? "School reactivated." : "School deactivated." } : r;
}

export async function deleteSchool(id: string, confirm: string): Promise<SchoolActionResult> {
  const session = await requireSession();
  if (!SCHOOL_ID.test(id) || typeof confirm !== "string" || !confirm.trim()) return { ok: false, message: "Invalid request." };
  const r = await call(`/console/schools/${id}/delete`, { confirm: confirm.trim().slice(0, 100) }, session.sub);
  return r.ok ? { ok: true, message: "School permanently deleted." } : r;
}
