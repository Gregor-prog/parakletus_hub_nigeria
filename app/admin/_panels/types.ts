export type PanelProps = {
  /** Path of the product page, for search and pagination links. */
  base: string;
  page: number;
  q?: string;
  /** Optional filter value (e.g. a status) from ?status=. */
  status?: string;
};
