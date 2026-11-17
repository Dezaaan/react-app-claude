import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { notesKeys, notesQueries } from "@/features/notes/api/notesQueries";
import { server } from "@/mocks/server";
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
