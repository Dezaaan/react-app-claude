import type { LoaderFunctionArgs } from "react-router-dom";
import { notesApi } from "../api/notesApi";

export const notesLoader = async ({ request }: LoaderFunctionArgs) => {
  const notes = await notesApi.getNotes({ signal: request.signal });

  return {
    notes,
  };
};
