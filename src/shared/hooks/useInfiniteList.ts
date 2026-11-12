import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { Paginated } from "@/shared/api/pagination";
import { usePendingIndicator } from "@/shared/pending/pendingContext";

export type FetchPage<T> = (
  page: number,
  signal: AbortSignal,
) => Promise<Paginated<T>>;

type InfiniteListState<T> = {
  items: T[];
  /** Last page loaded. */
  page: number;
  totalPages: number;
  totalItems: number;
  status: "idle" | "loading" | "error";
  error?: unknown;
};

const fromPage = <T>({
  items,
  pagination,
}: Paginated<T>): InfiniteListState<T> => ({
  items,
  page: pagination.page,
  totalPages: pagination.totalPages,
  totalItems: pagination.totalItems,
  status: "idle",
});

/**
 * A list that grows one page at a time ("infinite scroll").
 *
 * Starts from `firstPage` (usually from the route loader) and appends the
 * next page on `loadMore()`. Only one request runs at a time, items already
 * in the list are skipped (new items on the server shift the pages), and a
 * request still running when the list starts over or unmounts is cancelled.
 * When `firstPage` changes (the loader ran again), the list starts over.
 *
 * `firstPage` must keep its identity between renders (loader data does):
 * a new object means "start over". `fetchPage` should be stable too
 * (module level or useCallback).
 */
export const useInfiniteList = <T extends { id: string }>(
  firstPage: Paginated<T>,
  fetchPage: FetchPage<T>,
) => {
  const [source, setSource] = useState(firstPage);
  const [state, setState] = useState(() => fromPage(firstPage));

  // New data from the loader: start over (React's "adjust state when a
  // prop changes" pattern; the effect below cancels the old request).
  if (firstPage !== source) {
    setSource(firstPage);
    setState(fromPage(firstPage));
  }

  const stateRef = useRef(state);
  const requestRef = useRef<AbortController | null>(null);

  // A layout effect: it runs before any child's effects, and react-window
  // reports visible rows (which calls loadMore) from an effect. With a
  // plain effect, loadMore would still see the previous page and fetch it
  // again.
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    [firstPage],
  );

  const loadMore = useCallback(() => {
    const current = stateRef.current;

    // A ref, not state: two calls in the same tick must not both start.
    if (requestRef.current || current.page >= current.totalPages) {
      return;
    }

    const request = new AbortController();
    requestRef.current = request;
    setState((previous) => ({
      ...previous,
      status: "loading",
      error: undefined,
    }));

    fetchPage(current.page + 1, request.signal)
      .then(
        ({ items, pagination }) => {
          if (request.signal.aborted) return;

          setState((previous) => {
            const known = new Set(previous.items.map((item) => item.id));
            const added = items.filter((item) => !known.has(item.id));

            return {
              items: [...previous.items, ...added],
              page: pagination.page,
              totalPages: pagination.totalPages,
              totalItems: pagination.totalItems,
              status: "idle",
            };
          });
        },
        (error: unknown) => {
          if (request.signal.aborted) return;
          setState((previous) => ({ ...previous, status: "error", error }));
        },
      )
      .finally(() => {
        if (requestRef.current === request) {
          requestRef.current = null;
        }
      });
  }, [fetchPage]);

  usePendingIndicator(state.status === "loading");

  return {
    items: state.items,
    totalItems: state.totalItems,
    hasMore: state.page < state.totalPages,
    isLoading: state.status === "loading",
    /** The last loadMore() failed; call it again to retry. */
    error: state.status === "error" ? state.error : undefined,
    loadMore,
  };
};
