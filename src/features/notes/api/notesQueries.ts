import {
  infiniteQueryOptions,
  queryOptions,
  type InfiniteData,
} from "@tanstack/react-query";

import { notesApi } from "@/features/notes/api/notesApi";
import type { Paginated } from "@/shared/api/pagination";
import type { Note, NotesQuery } from "@/features/notes/types";

/**
 * Cache keys for notes, from broad to narrow. Invalidating a broader key
 * also covers the narrower ones: after a note changes,
 * `invalidateQueries({ queryKey: notesKeys.all })` refetches every list.
 */
export const notesKeys = {
  all: ["notes"] as const,
  lists: () => [...notesKeys.all, "list"] as const,
  list: (query: NotesQuery) => [...notesKeys.lists(), query] as const,
  /** The scrolling list on Home: every page loaded so far, in one entry. */
  infinite: (pageSize: number) =>
    [...notesKeys.all, "infinite", { pageSize }] as const,
};

/** Home loads this many notes at a time while scrolling. */
export const HOME_NOTES_PAGE_SIZE = 20;

/**
 * The loaded pages as one list. New notes on the server shift the pages,
 * so a note can come back on the next page; it's shown only once.
 */
const flattenPages = ({ pages }: InfiniteData<Paginated<Note>, number>) => {
  const seen = new Set<string>();
  const items = pages
    .flatMap((page) => page.items)
    .filter((note) => !seen.has(note.id) && seen.add(note.id));

  return { items, totalItems: pages.at(-1)?.pagination.totalItems ?? 0 };
};

/**
 * What to fetch for each key. Loaders and components use the same
 * definition, so they share one cache entry:
 * `queryClient.ensureQueryData(notesQueries.list(query))` in a loader,
 * `useQuery(notesQueries.list(query))` in a component.
 */
export const notesQueries = {
  /** One page of notes; `query` is part of the key, so each page is cached on its own. */
  list: (query: NotesQuery = {}) =>
    queryOptions({
      queryKey: notesKeys.list(query),
      queryFn: ({ signal }) => notesApi.getNotes(query, { signal }),
    }),

  /**
   * All notes, newest first, one page at a time: `fetchNextPage()` adds
   * the next page. The data is `{ items, totalItems }` for all pages so far.
   */
  infinite: (pageSize = HOME_NOTES_PAGE_SIZE) =>
    infiniteQueryOptions({
      queryKey: notesKeys.infinite(pageSize),
      queryFn: ({ pageParam, signal }) =>
        notesApi.getNotes({ page: pageParam, pageSize }, { signal }),
      initialPageParam: 1,
      getNextPageParam: ({ pagination }) =>
        pagination.page < pagination.totalPages
          ? pagination.page + 1
          : undefined,
      select: flattenPages,
    }),
};
