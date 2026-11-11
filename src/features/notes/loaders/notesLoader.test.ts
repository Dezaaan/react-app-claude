import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { AppError } from "@/app/errors/AppError";
import { ERROR_CODES } from "@/app/errors/errorCodes";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { loaderArgs } from "@/test/utils";
import type { Note } from "../types";
import { notesLoader } from "./notesLoader";

describe("notesLoader", () => {
  it("returns the notes from the API", async () => {
    const notes: Note[] = [
      { id: "1", title: "A", content: "a", createdAt: "2026-01-01" },
    ];
    server.use(http.get(apiUrl("/notes"), () => HttpResponse.json(notes)));

    await expect(notesLoader(loaderArgs("/notes"))).resolves.toEqual({
      notes,
    });
  });

  it("throws an AppError for the route's error element", async () => {
    server.use(...scenarios["notes-server-error"]);

    const error = await notesLoader(loaderArgs("/notes")).catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
  });
});
