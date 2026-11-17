import { queryOptions } from "@tanstack/react-query";

import { notesApi } from "@/features/notes/api/notesApi";
import type { NotesQuery } from "@/features/notes/types";

/**
 * Cache keys for notes, from broad to narrow. Invalidating a broader key
 * also covers the narrower ones: after a note changes,
 * `invalidateQueries({ queryKey: notesKeys.all })` refetches every list.
 */
export const notesKeys = {
  all: ["notes"] as const,
  lists: () => [...notesKeys.all, "list"] as const,
  list: (query: NotesQuery) => [...notesKeys.lists(), query] as const,
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
};
