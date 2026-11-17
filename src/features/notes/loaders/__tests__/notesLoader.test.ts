import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import type { Note } from "@/features/notes/types";
import { notesQueries } from "@/features/notes/api/notesQueries";
import { notesLoader } from "@/features/notes/loaders/notesLoader";
import { queryClient } from "@/shared/query/queryClient";

describe("notesLoader (Home)", () => {
  it("puts the first page from the API in the cache", async () => {
    const notes: Note[] = [
      {
        id: "1",
        title: "A",
        content: "a",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    const firstPage = {
      items: notes,
      pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
    };
    server.use(http.get(apiUrl("/notes"), () => HttpResponse.json(firstPage)));

    await notesLoader();

    expect(queryClient.getQueryData(notesQueries.infinite().queryKey)).toEqual({
      pages: [firstPage],
      pageParams: [1],
    });
  });

  it("throws an AppError for the route's error element", async () => {
    server.use(...scenarios["notes-server-error"]);

    const error = await notesLoader().catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
  });
});
