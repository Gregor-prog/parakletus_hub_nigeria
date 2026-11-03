/**
 * Server-side access to product backends. Reads URLs and service tokens from the
 * environment, so they never reach the browser. Import only from server code.
 */
import { PRODUCTS, getProduct, type Service } from "./products";

export type ServiceHealth = {
  product: string;
  service: string;
  state: "unconfigured" | "online" | "degraded" | "offline";
  httpStatus?: number;
  latencyMs?: number;
  host?: string; // hostname only — never the full URL, never the token
  checkedAt: string;
  error?: string;
};

const HEALTH_TIMEOUT_MS = 5000;

export function serviceBaseUrl(svc: Service): URL | null {
  const raw = process.env[`${svc.envPrefix}_API_URL`];
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    // Production backends must use TLS; plain http is allowed only for local dev.
    if (process.env.NODE_ENV === "production" && url.protocol === "http:") return null;
    return url;
  } catch {
    return null;
  }
}

function serviceToken(svc: Service): string | undefined {
  return process.env[`${svc.envPrefix}_API_TOKEN`] || undefined;
}

/** Join a base URL that may already carry a path (e.g. /api/v1) with a sub-path. */
export function joinUrl(base: URL, path: string): URL {
  const url = new URL(base.toString());
  const q = path.indexOf("?");
  const pathPart = q === -1 ? path : path.slice(0, q);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/${pathPart.replace(/^\/+/, "")}`;
  url.search = q === -1 ? "" : path.slice(q);
  url.hash = "";
  return url;
}

export function isServiceConfigured(svc: Service): boolean {
  return serviceBaseUrl(svc) !== null;
}

/** Server-only fetch against a product service, with its token attached. */
export async function serviceFetch(
  productSlug: string,
  serviceKey: string,
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const svc = getProduct(productSlug)?.services.find((s) => s.key === serviceKey);
  if (!svc) throw new Error(`Unknown service ${productSlug}/${serviceKey}`);
  const base = serviceBaseUrl(svc);
  if (!base) throw new Error(`${svc.envPrefix}_API_URL is not set`);

  const headers = new Headers(init.headers);
  const token = serviceToken(svc);
  // Each backend's /console/* API checks this header against its ADMIN_CONSOLE_TOKEN.
  if (token) headers.set("x-console-token", token);
  headers.set("accept", headers.get("accept") ?? "application/json");

  const { timeoutMs = 15000, ...rest } = init;
  return fetch(joinUrl(base, path), {
    ...rest,
    headers,
    cache: "no-store",
    redirect: "manual", // never follow a redirect off the configured host with our token
    signal: init.signal ?? AbortSignal.timeout(timeoutMs),
  });
}

async function checkService(productSlug: string, svc: Service): Promise<ServiceHealth> {
  const checkedAt = new Date().toISOString();
  const base = serviceBaseUrl(svc);
  if (!base) return { product: productSlug, service: svc.key, state: "unconfigured", checkedAt };

  const path = process.env[`${svc.envPrefix}_HEALTH_PATH`] || svc.healthPath;
  const started = performance.now();
  try {
    const res = await serviceFetch(productSlug, svc.key, path, { method: "GET", timeoutMs: HEALTH_TIMEOUT_MS });
    const latencyMs = Math.round(performance.now() - started);
    // Any answer below 500 means the server is up; only 2xx/3xx counts as healthy.
    const state = res.status < 400 ? "online" : res.status < 500 ? "degraded" : "offline";
    await res.body?.cancel();
    return { product: productSlug, service: svc.key, state, httpStatus: res.status, latencyMs, host: base.host, checkedAt };
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return {
      product: productSlug,
      service: svc.key,
      state: "offline",
      host: base.host,
      checkedAt,
      error: timedOut ? `No response in ${HEALTH_TIMEOUT_MS / 1000}s` : "Could not connect",
    };
  }
}

export async function checkAllServices(productSlug?: string): Promise<ServiceHealth[]> {
  const products = productSlug ? PRODUCTS.filter((p) => p.slug === productSlug) : PRODUCTS;
  return Promise.all(products.flatMap((p) => p.services.map((s) => checkService(p.slug, s))));
}

function urlProblem(svc: Service): string | undefined {
  const raw = process.env[`${svc.envPrefix}_API_URL`];
  if (!raw || serviceBaseUrl(svc)) return undefined;
  try {
    const { protocol } = new URL(raw);
    return protocol === "http:" ? "Needs https" : "Invalid URL";
  } catch {
    return "Invalid URL";
  }
}

/** Which env vars are set, for the Connections page. Booleans only, never values. */
export function connectionReport() {
  return PRODUCTS.flatMap((p) =>
    p.services.map((s) => {
      const base = serviceBaseUrl(s);
      return {
        product: p.slug,
        productName: p.name,
        service: s.key,
        serviceLabel: s.label,
        envPrefix: s.envPrefix,
        urlSet: Boolean(process.env[`${s.envPrefix}_API_URL`]),
        urlValid: base !== null,
        urlProblem: urlProblem(s),
        host: base?.host,
        tokenSet: Boolean(serviceToken(s)),
        healthPath: process.env[`${s.envPrefix}_HEALTH_PATH`] || s.healthPath,
        repo: s.repo,
      };
    }),
  );
}
