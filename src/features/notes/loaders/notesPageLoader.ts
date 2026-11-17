import type { LoaderFunctionArgs } from "react-router-dom";

import { notesQueries } from "@/features/notes/api/notesQueries";
import { notesQueryFromUrl } from "@/features/notes/helpers/notesQuery";
import { queryClient } from "@/shared/query/queryClient";

/**
 * Makes sure the page of notes the URL asks for (page, filters, sorting)
 * is in the cache before the page shows. A page seen in the last 30 s
 * comes from the cache with no request; an older one shows at once and
 * the page refreshes it in the background.
 */
export const notesPageLoader = async ({ request }: LoaderFunctionArgs) => {
  const query = notesQueryFromUrl(new URL(request.url).searchParams);
  await queryClient.ensureQueryData(notesQueries.list(query));

  // The page reads the notes from the cache with this same query.
  return { query };
};
