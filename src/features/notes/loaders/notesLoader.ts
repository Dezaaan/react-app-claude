import { notesQueries } from "@/features/notes/api/notesQueries";
import { queryClient } from "@/shared/query/queryClient";

/**
 * Home: makes sure the scrolling list's first page is in the cache before
 * the page shows. Pages loaded on an earlier visit stay, so coming back
 * keeps the list as it was.
 */
export const notesLoader = async () => {
  await queryClient.ensureInfiniteQueryData(notesQueries.infinite());
  // The page reads the notes from the cache.
  return null;
};
