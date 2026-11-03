import type { ComponentType } from "react";
import { ParaLearnCbtView, ParaLearnOverview, ParaLearnSchoolsView } from "./paralearn";
import { IjsdsOverview, IjsdsSubmissionsView } from "./ijsds";
import { SabiNoteOverview, SabiNoteTransactionsView, SabiNoteUsersView } from "./sabinote";
import type { PanelProps } from "./types";

type Panels = { overview?: ComponentType; views: Record<string, ComponentType<PanelProps>> };

/** Live data panels per product. Keys must match `views` in lib/admin/products.ts. */
export const PANELS: Record<string, Panels> = {
  paralearn: {
    overview: ParaLearnOverview,
    views: { schools: ParaLearnSchoolsView, cbt: ParaLearnCbtView },
  },
  ijsds: {
    overview: IjsdsOverview,
    views: { submissions: IjsdsSubmissionsView },
  },
  sabinote: {
    overview: SabiNoteOverview,
    views: { users: SabiNoteUsersView, transactions: SabiNoteTransactionsView },
  },
};
