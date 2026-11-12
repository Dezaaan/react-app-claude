import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { loaderArgs } from "@/test/utils";
import type { Note } from "@/features/notes/types";
import { notesLoader } from "./notesLoader";

describe("notesLoader (Home)", () => {
  it("returns the first page from the API", async () => {
    const notes: Note[] = [
      {
        id: "1",
        title: "A",
        content: "a",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    server.use(
      http.get(apiUrl("/notes"), () =>
        HttpResponse.json({
          items: notes,
          pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 },
        }),
      ),
    );

    await expect(notesLoader(loaderArgs("/"))).resolves.toEqual({
      notes: {
        items: notes,
        pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 },
      },
    });
  });

  it("throws an AppError for the route's error element", async () => {
    server.use(...scenarios["notes-server-error"]);

    const error = await notesLoader(loaderArgs("/notes")).catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
  });
});
