import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { LOAD_TIMEOUT, renderApp } from "@/test/utils";

// Home on the real route tree, against the mock backend's notes.

/** The notes in the list, by title (each note's button is named by it). */
const notesShown = () =>
  within(screen.getByRole("list", { name: "Notes" }))
    .getAllByRole("listitem")
    .map((item) => within(item).getByRole("button"));

describe("Home page", () => {
  it("shows the newest notes first, and how many there are", async () => {
    renderApp("/");

    expect(
      await screen.findByText("20 of 1000 notes loaded", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    expect(notesShown()[0]).toHaveAccessibleName("Note 1");
    expect(notesShown()[0]).toHaveAccessibleDescription(
      /^\d{2}\/\d{2}\/\d{4} This is the content of note 1/,
    );
  });

  it("loads the next page when the first one doesn't fill the list", async () => {
    // 3 notes per page: the list has room for more, so it asks at once.
    server.use(
      http.get(apiUrl("/notes"), ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
        const items = [1, 2, 3]
          .map((n) => (page - 1) * 3 + n)
          .filter((n) => n <= 7)
          .map((n) => ({
            id: String(n),
            title: `Note ${n}`,
            content: "",
            createdAt: "2026-11-10T08:00:00.000Z",
            updatedAt: "2026-11-10T08:00:00.000Z",
          }));
        return HttpResponse.json({
          items,
          pagination: { page, pageSize: 3, totalItems: 7, totalPages: 3 },
        });
      }),
    );

    const pagesRequested: string[] = [];
    server.events.on("request:start", ({ request }) => {
      const url = new URL(request.url);
      if (url.pathname.endsWith("/notes")) {
        pagesRequested.push(url.searchParams.get("page") ?? "1");
      }
    });

    renderApp("/");

    expect(
      await screen.findByText("That's all 7 notes.", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    await waitFor(() => expect(notesShown()).toHaveLength(7));
    // Each page exactly once.
    expect(pagesRequested).toEqual(["1", "2", "3"]);
    server.events.removeAllListeners();
  });

  it("says so when there are no notes", async () => {
    server.use(
      http.get(apiUrl("/notes"), () =>
        HttpResponse.json({
          items: [],
          pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
        }),
      ),
    );

    renderApp("/");

    expect(
      await screen.findByText("No notes yet.", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument();
  });
});
