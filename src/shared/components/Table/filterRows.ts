import type { TableColumn, TableFilters } from "./types";

/**
 * Keeps the rows that match every active column filter
 * (case-insensitive "contains"). Returns `rows` itself when no filter is
 * active, so nothing re-renders needlessly.
 */
export const filterRows = <T>(
  rows: T[],
  filters: TableFilters,
  columns: TableColumn<T>[],
) => {
  // Resolve active filters once instead of once per row.
  const activeFilters = columns.flatMap((column) => {
    const query = filters[column.id]?.trim().toLowerCase();
    return query ? [{ column, query }] : [];
  });

  if (activeFilters.length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    activeFilters.every(({ column, query }) => {
      const value = row[column.accessor];
      const text = column.filterValue
        ? column.filterValue(value, row)
        : String(value);

      return text.toLowerCase().includes(query);
    }),
  );
};
