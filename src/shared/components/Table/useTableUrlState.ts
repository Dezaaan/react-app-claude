import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  SortOrder,
  TableFilters,
  TableSort,
} from "@/shared/components/Table/types";
import { useDebouncedValue } from "@/shared/hooks/useDebounceValue";
import { usePendingIndicator } from "@/shared/pending/pendingContext";

/** Query parameter names. Filters use their own keys (e.g. `title`). */
export const TABLE_PARAMS = {
  page: "page",
  pageSize: "pageSize",
  sortBy: "sortBy",
  sortOrder: "sortOrder",
} as const;

type UseTableUrlStateOptions = {
  /** Query parameters edited by filter inputs, e.g. ["search", "title"]. */
  filterKeys: readonly string[];
  defaultSort: TableSort;
  defaultPageSize: number;
  /** Wait this long after the last keystroke before filtering. */
  delay?: number;
};

const serialize = (filters: TableFilters, keys: readonly string[]) =>
  keys.map((key) => filters[key]?.trim() ?? "").join("\u0000");

/**
 * Table state kept in the URL, for tables whose rows come from the server
 * one page at a time (the route loader reads the same URL).
 *
 * The URL is the source of truth, so a page can be bookmarked, shared and
 * reached with the back button. Filter inputs update the URL after the
 * user pauses typing (meanwhile the page's loading bar shows) and go back
 * to page 1. Sorting goes back to page 1 too.
 *
 * For rows that are all loaded already, use `useTableFilters` instead.
 */
export const useTableUrlState = ({
  filterKeys,
  defaultSort,
  defaultPageSize,
  delay = 300,
}: UseTableUrlStateOptions) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(
    () =>
      Object.fromEntries(
        filterKeys.map((key) => [key, searchParams.get(key) ?? ""]),
      ) as TableFilters,
    [searchParams, filterKeys],
  );
  const urlKey = serialize(urlFilters, filterKeys);

  // What the inputs show; ahead of the URL while the user is typing.
  const [filters, setFilters] = useState(urlFilters);
  const appliedFilters = useDebouncedValue(filters, delay);

  const lastPushedKey = useRef(urlKey);
  // Read by the effects below without re-running them on every URL change.
  const urlFiltersRef = useRef(urlFilters);
  useEffect(() => {
    urlFiltersRef.current = urlFilters;
  }, [urlFilters]);

  // The URL changed by itself (back button, a link): show its filters.
  useEffect(() => {
    if (urlKey !== lastPushedKey.current) {
      lastPushedKey.current = urlKey;
      setFilters(urlFiltersRef.current);
    }
  }, [urlKey]);

  // The user paused typing: put the filters in the URL, from page 1.
  useEffect(() => {
    const appliedKey = serialize(appliedFilters, filterKeys);

    if (appliedKey === serialize(urlFiltersRef.current, filterKeys)) {
      return;
    }

    lastPushedKey.current = appliedKey;
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        for (const key of filterKeys) {
          const value = appliedFilters[key]?.trim();
          if (value) next.set(key, value);
          else next.delete(key);
        }
        next.delete(TABLE_PARAMS.page);
        return next;
      },
      // Typing shouldn't add a history entry per pause.
      { replace: true },
    );
  }, [appliedFilters, filterKeys, setSearchParams]);

  usePendingIndicator(serialize(filters, filterKeys) !== urlKey);

  const onFilterChange = useCallback((key: string, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const sort: TableSort = {
    columnId: searchParams.get(TABLE_PARAMS.sortBy) ?? defaultSort.columnId,
    order:
      (searchParams.get(TABLE_PARAMS.sortOrder) as SortOrder | null) ??
      defaultSort.order,
  };

  /** Same column: flip the order. Another column: ascending. */
  const onSortChange = (columnId: string) => {
    const order: SortOrder =
      sort.columnId === columnId && sort.order === "asc" ? "desc" : "asc";

    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set(TABLE_PARAMS.sortBy, columnId);
      next.set(TABLE_PARAMS.sortOrder, order);
      next.delete(TABLE_PARAMS.page);
      return next;
    });
  };

  const page = Math.max(1, Number(searchParams.get(TABLE_PARAMS.page)) || 1);
  const pageSize =
    Number(searchParams.get(TABLE_PARAMS.pageSize)) || defaultPageSize;

  const hrefForPage = (target: number) => {
    const next = new URLSearchParams(searchParams);
    if (target === 1) next.delete(TABLE_PARAMS.page);
    else next.set(TABLE_PARAMS.page, String(target));
    const query = next.toString();
    return query ? `?${query}` : "?";
  };

  const setPageSize = (size: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (size === defaultPageSize) next.delete(TABLE_PARAMS.pageSize);
      else next.set(TABLE_PARAMS.pageSize, String(size));
      next.delete(TABLE_PARAMS.page);
      return next;
    });
  };

  return {
    filters,
    onFilterChange,
    sort,
    onSortChange,
    page,
    pageSize,
    setPageSize,
    hrefForPage,
  };
};
