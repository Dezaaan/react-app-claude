import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

/** 7 notes, 3 per page, so the list asks for pages 2 and 3 by itself. */
const serveSevenNotes = () =>
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

/** The `page` of every GET /notes answered with notes. */
const recordPagesRequested = () => {
  const pages: string[] = [];
  server.events.on("response:mocked", ({ request, response }) => {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/notes") && response.ok) {
      pages.push(url.searchParams.get("page") ?? "1");
    }
  });
  return pages;
};

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
    serveSevenNotes();
    const pagesRequested = recordPagesRequested();

    renderApp("/");

    expect(
      await screen.findByText("That's all 7 notes.", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    await waitFor(() => expect(notesShown()).toHaveLength(7));
    // Each page exactly once.
    expect(pagesRequested).toEqual(["1", "2", "3"]);
  });

  it("keeps the loaded notes when the user comes back", async () => {
    serveSevenNotes();
    const pagesRequested = recordPagesRequested();
    const router = renderApp("/");
    await screen.findByText("That's all 7 notes.", {}, LOAD_TIMEOUT);

    await router.navigate("/about");
    await screen.findByRole("heading", { name: "About" }, LOAD_TIMEOUT);
    await router.navigate("/");

    // The list re-renders while it settles, so look the text up each time.
    await waitFor(() => {
      expect(screen.getByText("That's all 7 notes.")).toBeInTheDocument();
      expect(notesShown()).toHaveLength(7);
    }, LOAD_TIMEOUT);
    // From the cache: no page was asked for again.
    expect(pagesRequested).toEqual(["1", "2", "3"]);
  });

  it("says when more notes couldn't load, and tries again", async () => {
    serveSevenNotes();
    // Page 2 fails the first time it's asked for.
    let page2Requests = 0;
    server.use(
      http.get(apiUrl("/notes"), ({ request }) => {
        const page = new URL(request.url).searchParams.get("page");
        if (page === "2" && ++page2Requests === 1) {
          return HttpResponse.json(
            { error: { code: "INTERNAL_SERVER_ERROR", message: "Oops" } },
            { status: 500 },
          );
        }
        return undefined; // the notes from serveSevenNotes
      }),
    );

    renderApp("/");

    const retry = await screen.findByRole(
      "button",
      { name: "Try again" },
      LOAD_TIMEOUT,
    );
    // The notes already loaded stay.
    expect(notesShown()).toHaveLength(3);

    await userEvent.click(retry);

    expect(
      await screen.findByText("That's all 7 notes.", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument();
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
