import { QueryClientProvider, useInfiniteQuery } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { notesKeys, notesQueries } from "@/features/notes/api/notesQueries";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { queryClient } from "@/shared/query/queryClient";

describe("notesQueries.list", () => {
  it("fetches a page of notes with the query", async () => {
    const notes = await queryClient.fetchQuery(
      notesQueries.list({ page: 2, pageSize: 20 }),
    );

    expect(notes.pagination.page).toBe(2);
    expect(notes.items).toHaveLength(20);
  });

  it("asks the server once while the data is fresh", async () => {
    // Successful answers only: the first request may get a 401 and be
    // repeated after the session is restored.
    let requests = 0;
    server.events.on("response:mocked", ({ request, response }) => {
      if (new URL(request.url).pathname.endsWith("/notes") && response.ok) {
        requests += 1;
      }
    });

    const query = notesQueries.list({ page: 1 });
    await queryClient.fetchQuery(query);
    await queryClient.fetchQuery(query);

    expect(requests).toBe(1);
    server.events.removeAllListeners();
  });

  it("keeps each query in its own cache entry, all under notesKeys.all", async () => {
    await queryClient.fetchQuery(notesQueries.list({ page: 1 }));
    await queryClient.fetchQuery(notesQueries.list({ page: 2 }));

    expect(
      queryClient.getQueriesData({ queryKey: notesKeys.all }),
    ).toHaveLength(2);
  });

  it("fails with the API error", async () => {
    server.use(
      http.get("*/notes", () =>
        HttpResponse.json({ message: "Nope" }, { status: 403 }),
      ),
    );

    await expect(
      queryClient.fetchQuery(notesQueries.list()),
    ).rejects.toMatchObject({ status: 403 });
  });
});

const note = (id: number) => ({
  id: String(id),
  title: `Note ${id}`,
  content: "",
  createdAt: "2026-11-10T08:00:00.000Z",
  updatedAt: "2026-11-10T08:00:00.000Z",
});

/** Answers page N with `pages[N - 1]` (note ids), 3 pages in all. */
const servePages = (pages: number[][], totalItems: number) =>
  server.use(
    http.get(apiUrl("/notes"), ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get("page"));
      return HttpResponse.json({
        items: pages[page - 1].map(note),
        pagination: { page, pageSize: 3, totalItems, totalPages: pages.length },
      });
    }),
  );

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

/**
 * The hook re-renders only for the result properties a component reads;
 * a test reads them later, so it asks for every change.
 */
const useScrollingNotes = () =>
  useInfiniteQuery({ ...notesQueries.infinite(3), notifyOnChangeProps: "all" });

describe("notesQueries.infinite", () => {
  it("adds the next page to the list until the last one", async () => {
    servePages([[1, 2, 3], [4, 5, 6], [7]], 7);
    const { result } = renderHook(useScrollingNotes, { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await result.current.fetchNextPage();
    await result.current.fetchNextPage();

    await waitFor(() =>
      expect(result.current.data?.items.map((n) => n.id)).toEqual([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
      ]),
    );
    expect(result.current.data?.totalItems).toBe(7);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("shows a note once when it comes back on the next page", async () => {
    // A new note on the server pushed note 3 from page 1 to page 2.
    servePages(
      [
        [1, 2, 3],
        [3, 4, 5],
        [6, 7, 8],
      ],
      8,
    );
    const { result } = renderHook(useScrollingNotes, { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await result.current.fetchNextPage();

    await waitFor(() =>
      expect(result.current.data?.items.map((n) => n.id)).toEqual([
        "1",
        "2",
        "3",
        "4",
        "5",
      ]),
    );
  });
});
