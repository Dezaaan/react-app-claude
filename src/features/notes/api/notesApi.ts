import { httpClient } from "@/shared/api/httpClient";
import type { Note } from "../types";

type RequestConfig = { signal?: AbortSignal };

export const notesApi = {
  getNotes: ({ signal }: RequestConfig = {}) =>
    httpClient.get<Note[]>("/notes", { signal }),
};
