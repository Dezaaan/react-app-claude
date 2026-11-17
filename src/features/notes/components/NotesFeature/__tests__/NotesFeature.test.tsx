import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { notesQueries } from "@/features/notes/api/notesQueries";
import { NotesFeature } from "@/features/notes/components/NotesFeature/NotesFeature";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { queryClient } from "@/shared/query/queryClient";

// A stand-in for the virtualized list, with a button for "the end of the
// list came into view".
vi.mock("@/features/notes/components/NotesList/NotesList", () => ({
  NotesList: ({
    notes,
    onEndReached,
  }: {
    notes: unknown[];
    onEndReached: () => void;
  }) => (
    <>
      <p>{notes.length} notes</p>
      <button onClick={onEndReached}>Reached the end</button>
    </>
  ),
}));

describe("NotesFeature", () => {
  it("doesn't start the next page over when the list asks again", async () => {
    // What the route loader does before the page shows.
    await queryClient.fetchInfiniteQuery(notesQueries.infinite());
    const page2Requests: string[] = [];
    server.events.on("request:start", ({ request }) => {
      const url = new URL(request.url);
      if (
        url.href.startsWith(apiUrl("/notes")) &&
        url.searchParams.get("page") === "2"
      ) {
        page2Requests.push(url.search);
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <NotesFeature />
      </QueryClientProvider>,
    );
    const end = screen.getByRole("button", { name: "Reached the end" });

    await userEvent.click(end);
    await waitFor(() => expect(page2Requests).toHaveLength(1));
    // Page 2 is on its way (the mock server takes 300 ms) and the list,
    // still scrolling, asks again.
    await userEvent.click(end);

    await waitFor(() =>
      expect(screen.getByText("40 notes")).toBeInTheDocument(),
    );
    expect(page2Requests).toHaveLength(1);
  });
});
