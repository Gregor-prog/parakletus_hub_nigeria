/**
 * Product registry for the admin console — the single place that lists every
 * Parakletus product, its backend services, and what the console will manage.
 *
 * Safe to import from client components: it holds env var NAMES only, never
 * values. Backend URLs and tokens are read on the server in ./backends.ts.
 *
 * Wiring a backend: set the service's `envPrefix`_API_URL (and optionally
 * _API_TOKEN / _HEALTH_PATH) in the environment. No code change needed.
 */

export type ProductStatus = "live" | "coming-soon" | "roadmap";
export type Sector = "TECHNOLOGY" | "PUBLISHING" | "EDUCATION";

export type Service = {
  key: string;
  label: string;
  /** Env vars read: `${envPrefix}_API_URL`, `${envPrefix}_API_TOKEN`, `${envPrefix}_HEALTH_PATH` */
  envPrefix: string;
  /** Default health path, relative to the API URL. */
  healthPath: string;
  repo?: string;
};

export type Module = {
  key: string;
  label: string;
  description: string;
  /** Which service it will read from once the endpoint is agreed. */
  service?: string;
};

/** A tab on the product page backed by a real backend endpoint. */
export type View = {
  key: string;
  label: string;
  service: string;
};

export type Product = {
  slug: string;
  code: string;
  name: string;
  tagline: string;
  sector: Sector;
  status: ProductStatus;
  accent: "ember" | "grove" | "ink";
  logo?: string;
  publicUrl?: string;
  services: Service[];
  /** Live data tabs (beyond Overview). Empty until the backend has a /console API. */
  views: View[];
  /** Planned areas not wired to an endpoint yet. */
  modules: Module[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "paralearn",
    code: "PARALEARN",
    name: "ParaLearn",
    tagline: "Result management for African schools",
    sector: "TECHNOLOGY",
    status: "live",
    accent: "ember",
    logo: "/paralearn-logo.png",
    publicUrl: "https://pln.ng",
    services: [
      { key: "core", label: "Core API", envPrefix: "PARALEARN", healthPath: "/health", repo: "parakletus-hub-nigeria/paralearn-backend" },
      { key: "cbt", label: "CBT service", envPrefix: "PARALEARN_CBT", healthPath: "/health", repo: "parakletus-hub-nigeria/paralearn-cbt-backend" },
    ],
    views: [
      { key: "schools", label: "Schools", service: "core" },
      { key: "cbt", label: "CBT", service: "cbt" },
    ],
    modules: [
      { key: "attendance", label: "Attendance", description: "Daily attendance coverage by school.", service: "core" },
      { key: "audit", label: "Audit log", description: "Recent platform-level changes.", service: "core" },
    ],
  },
  {
    slug: "sabinote",
    code: "SABINOTE",
    name: "SabiNote",
    tagline: "AI-powered lesson note generation",
    sector: "TECHNOLOGY",
    status: "live",
    accent: "grove",
    logo: "/sabinote-logo.svg",
    publicUrl: "https://sabinote.pln.ng",
    services: [
      // SABINOTE_API_URL includes the /api/v1 prefix, so paths here are relative to it.
      { key: "api", label: "API", envPrefix: "SABINOTE", healthPath: "/health", repo: "parakletus-hub-nigeria/sabinote_backend" },
    ],
    views: [
      { key: "users", label: "Educators", service: "api" },
      { key: "transactions", label: "Transactions", service: "api" },
    ],
    modules: [
      { key: "schemes", label: "Schemes of work", description: "State schemes loaded and their coverage.", service: "api" },
    ],
  },
  {
    slug: "ijsds",
    code: "IJSDS",
    name: "IJSDS",
    tagline: "International Journal of Social Work and Development Studies",
    sector: "PUBLISHING",
    status: "live",
    accent: "grove",
    logo: "/ijsds-logo.png",
    publicUrl: "https://ijsds.org",
    services: [
      { key: "api", label: "API", envPrefix: "IJSDS", healthPath: "/", repo: "Gregor-prog/IJSDSBackend" },
    ],
    views: [],
    modules: [
      { key: "submissions", label: "Submissions", description: "Manuscripts by stage, from received to accepted.", service: "api" },
      { key: "reviews", label: "Reviews", description: "Reviewer assignments, turnaround and overdue reviews.", service: "api" },
      { key: "articles", label: "Published articles", description: "Issues, monthly batches and Crossref deposits.", service: "api" },
      { key: "requests", label: "Role requests", description: "Reviewer applications and role requests.", service: "api" },
      { key: "payments", label: "Payments", description: "Article processing charges and their status.", service: "api" },
    ],
  },
  {
    slug: "publishing",
    code: "PUBLISHING",
    name: "Parakletus Publishing",
    tagline: "Academic publishing services",
    sector: "PUBLISHING",
    status: "coming-soon",
    accent: "ink",
    services: [
      { key: "api", label: "API", envPrefix: "PUBLISHING", healthPath: "/", repo: "Gregor-prog/paralearn_publishing" },
    ],
    views: [],
    modules: [
      { key: "enquiries", label: "Enquiries", description: "Service requests from the publishing site.", service: "api" },
      { key: "projects", label: "Projects", description: "Editing, ghostwriting and design jobs in progress.", service: "api" },
      { key: "isbn", label: "ISBNs", description: "Allocated ISBNs and generated barcodes.", service: "api" },
    ],
  },
  {
    slug: "gsi",
    code: "GSI",
    name: "GSI Buildathon",
    tagline: "Global South Index initiative",
    sector: "TECHNOLOGY",
    status: "live",
    accent: "ink",
    logo: "/gsi-logo.png",
    publicUrl: "https://gsi.parakletushub.com",
    services: [{ key: "api", label: "API", envPrefix: "GSI", healthPath: "/" }],
    views: [],
    modules: [
      { key: "applications", label: "Applications", description: "Buildathon applicants by role and stage.", service: "api" },
      { key: "teams", label: "Teams", description: "Formed teams and their submissions.", service: "api" },
    ],
  },
  {
    slug: "academy",
    code: "ACADEMY",
    name: "ParaLearn Academy",
    tagline: "K-12 digital skill training",
    sector: "EDUCATION",
    status: "coming-soon",
    accent: "ink",
    services: [],
    views: [],
    modules: [],
  },
  {
    slug: "ayolo",
    code: "AYỌ̀LỌ̀",
    name: "Ayọ̀lọ̀ Systems",
    tagline: "Stablecoin cross-border payment rails",
    sector: "TECHNOLOGY",
    status: "roadmap",
    accent: "ink",
    services: [],
    views: [],
    modules: [],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: "Live",
  "coming-soon": "Coming soon",
  roadmap: "Roadmap",
};
