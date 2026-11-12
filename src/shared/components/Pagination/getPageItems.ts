export type PageItem = number | "gap";

/**
 * The page numbers to show: always the first and last page, the current
 * page with `siblings` on each side, and "gap" (…) for what's skipped.
 * A gap that would hide a single page shows that page instead.
 *
 *   getPageItems(6, 20) -> [1, "gap", 5, 6, 7, "gap", 20]
 */
export const getPageItems = (
  page: number,
  totalPages: number,
  siblings = 1,
): PageItem[] => {
  if (totalPages <= 0) return [];

  const start = Math.max(1, page - siblings);
  const end = Math.min(totalPages, page + siblings);
  const items: PageItem[] = [];

  if (start > 1) items.push(1);
  if (start === 3) items.push(2);
  if (start > 3) items.push("gap");

  for (let n = start; n <= end; n += 1) items.push(n);

  if (end < totalPages - 2) items.push("gap");
  if (end === totalPages - 2) items.push(totalPages - 1);
  if (end < totalPages) items.push(totalPages);

  return items;
};
