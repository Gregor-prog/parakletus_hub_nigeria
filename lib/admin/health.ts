import { cache } from "react";
import { checkAllServices } from "./backends";

/** One round of health checks per request, however many components ask. */
export const getHealth = cache(() => checkAllServices());
