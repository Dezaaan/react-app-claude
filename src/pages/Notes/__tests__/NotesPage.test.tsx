import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { notesQueries } from "@/features/notes/api/notesQueries";
import { notesQueryFromUrl } from "@/features/notes/helpers/notesQuery";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { STALE_TIME, queryClient } from "@/shared/query/queryClient";
import { LOAD_TIMEOUT, renderApp } from "@/test/utils";

// How the Notes page uses the cache, against the mock backend's 1,000
// notes ("Note 1" is the newest).

const status = () => screen.getByRole("status");

/** Counts GET /notes answered with data (a 401 that's repeated isn't one). */
const countNotesResponses = () => {
  const counter = { count: 0 };
  server.events.on("response:mocked", ({ request, response }) => {
    if (request.url.startsWith(apiUrl("/notes")) && response.ok) {
      counter.count += 1;
    }
  });
  return counter;
};

describe("Notes page cache", () => {
  it("shows a page seen moments ago from the cache, with no request", async () => {
    const responses = countNotesResponses();
    renderApp("/notes");
    await screen.findByRole("table", { name: "Notes" }, LOAD_TIMEOUT);

    await userEvent.click(screen.getByRole("link", { name: "Page 2" }));
    await waitFor(() =>
      expect(status()).toHaveTextContent("Showing 21–40 of 1,000 notes"),
    );
    await userEvent.click(screen.getByRole("link", { name: "Page 1" }));
    await waitFor(() =>
      expect(status()).toHaveTextContent("Showing 1–20 of 1,000 notes"),
    );

    // Page 1 and page 2, but not page 1 again.
    expect(responses.count).toBe(2);
  });

  it("shows older data at once, then replaces it with fresh data", async () => {
    // What a visit more than 30 s ago left in the cache.
    const query = notesQueryFromUrl(new URLSearchParams());
    queryClient.setQueryData(
      notesQueries.list(query).queryKey,
      {
        items: [
          {
            id: "old",
            title: "Cached note",
            content: "From an earlier visit",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
      },
      { updatedAt: Date.now() - STALE_TIME - 1000 },
    );

    renderApp("/notes");

    // No waiting for the server: the cached page shows first...
    expect(
      await screen.findByText("Cached note", {}, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    expect(status()).toHaveTextContent("1 note");

    // ...and is replaced when the background refresh arrives.
    await waitFor(() =>
      expect(status()).toHaveTextContent("Showing 1–20 of 1,000 notes"),
    );
    expect(screen.queryByText("Cached note")).not.toBeInTheDocument();
  });
});
