import type { LoaderFunctionArgs } from "react-router-dom";

import { notesApi } from "@/features/notes/api/notesApi";
import { notesQueryFromUrl } from "@/features/notes/helpers/notesQuery";

/** The page of notes the URL asks for (page, filters, sorting). */
export const notesPageLoader = async ({ request }: LoaderFunctionArgs) => {
  const query = notesQueryFromUrl(new URL(request.url).searchParams);
  const notes = await notesApi.getNotes(query, { signal: request.signal });

  return { notes, query };
};
