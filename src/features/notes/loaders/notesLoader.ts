import type { LoaderFunctionArgs } from "react-router-dom";

import { MAX_PAGE_SIZE } from "@/shared/api/pagination";
import { notesApi } from "@/features/notes/api/notesApi";

// For now: the newest notes, one full page.
export const notesLoader = async ({ request }: LoaderFunctionArgs) => {
  const { items } = await notesApi.getNotes(
    { pageSize: MAX_PAGE_SIZE },
    { signal: request.signal },
  );

  return {
    notes: items,
  };
};
