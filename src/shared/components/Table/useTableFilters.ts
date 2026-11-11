import { useCallback, useMemo, useState } from "react";

import { useDebouncedValue } from "@/shared/hooks/useDebounceValue";
import { usePendingIndicator } from "@/shared/pending/pendingContext";
import { filterRows } from "./filterRows";
import type { TableColumn, TableFilters } from "./types";

/**
 * Filter state for a Table: what the inputs show, and the rows that match.
 *
 * Filtering waits until the user pauses typing (`delay` ms), so large
 * tables stay responsive. Meanwhile the page's loading indicator is shown,
 * so the user can see the results are about to change.
 *
 * ```tsx
 * const { filters, onFilterChange, rows } = useTableFilters(data, columns);
 *
 * <Table rowCount={rows.length}>
 *   <Table.Header columns={columns} filters={filters} onFilterChange={onFilterChange} />
 *   <Table.Body data={rows} columns={columns} />
 * </Table>
 * ```
 */
export const useTableFilters = <T>(
  data: T[],
  columns: TableColumn<T>[],
  delay = 200,
) => {
  const [filters, setFilters] = useState<TableFilters>({});
  const appliedFilters = useDebouncedValue(filters, delay);

  const rows = useMemo(
    () => filterRows(data, appliedFilters, columns),
    [data, appliedFilters, columns],
  );

  // Every change creates a new filters object; they match again once the
  // debounced value catches up and the rows are filtered.
  const isFiltering = filters !== appliedFilters;
  usePendingIndicator(isFiltering);

  const onFilterChange = useCallback((columnId: string, value: string) => {
    setFilters((previous) => ({ ...previous, [columnId]: value }));
  }, []);

  return { filters, onFilterChange, rows, isFiltering };
};
