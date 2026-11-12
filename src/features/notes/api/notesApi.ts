import { httpClient } from "@/shared/api/httpClient";
import type { Paginated } from "@/shared/api/pagination";
import type { Note, NotesQuery } from "@/features/notes/types";

type RequestConfig = { signal?: AbortSignal };

export const notesApi = {
  /** One page of the user's notes. */
  getNotes: (query: NotesQuery = {}, { signal }: RequestConfig = {}) =>
    httpClient.get<Paginated<Note>>("/notes", { query, signal }),
};
