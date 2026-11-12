import type { LoaderFunctionArgs } from "react-router-dom";

import { notesApi } from "@/features/notes/api/notesApi";

/** Home loads this many notes at a time while scrolling. */
export const HOME_NOTES_PAGE_SIZE = 20;

/** Home: the first page of notes, newest first; the rest load on scroll. */
export const notesLoader = async ({ request }: LoaderFunctionArgs) => {
  const notes = await notesApi.getNotes(
    { pageSize: HOME_NOTES_PAGE_SIZE },
    { signal: request.signal },
  );

  return { notes };
};
