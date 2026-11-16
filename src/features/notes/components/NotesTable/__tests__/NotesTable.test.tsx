import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { LOAD_TIMEOUT, renderApp } from "@/test/utils";

// The Notes page on the real route tree, against the mock backend's 1,000
// notes ("Note 1" is the newest).

const status = () => screen.getByRole("status");

const openNotes = async (path = "/notes") => {
  const router = renderApp(path);
  await screen.findByRole("table", { name: "Notes" }, LOAD_TIMEOUT);
  return router;
};

const titles = () =>
  screen
    .getAllByRole("row")
    .slice(2) // the header rows
    .map((row) => within(row).getAllByRole("cell")[0].textContent);

/** Records the query of every GET /notes. */
const recordNotesQueries = () => {
  const queries: string[] = [];
  server.events.on("request:start", ({ request }) => {
    const url = new URL(request.url);
    if (url.href.startsWith(apiUrl("/notes"))) queries.push(url.search);
  });
  return queries;
};

describe("Notes page", () => {
  it("shows the first page, newest first, with page links", async () => {
    await openNotes();

    expect(status()).toHaveTextContent("Showing 1–20 of 1,000 notes");
    expect(titles().slice(0, 2)).toEqual(["Note 1", "Note 2"]);
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "1002");
    expect(screen.getByRole("link", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Page 50" })).toBeInTheDocument();
  });

  it("goes to another page with a link, and back", async () => {
    const router = await openNotes();

    await userEvent.click(screen.getByRole("link", { name: "Page 2" }));

    await waitFor(() =>
      expect(status()).toHaveTextContent("Showing 21–40 of 1,000 notes"),
    );
    expect(router.state.location.search).toBe("?page=2");
    expect(titles()[0]).toBe("Note 21");

    await router.navigate(-1);
    await waitFor(() => expect(titles()[0]).toBe("Note 1"));
  });

  it("filters by title on the server and starts again from page 1", async () => {
    const router = await openNotes("/notes?page=3");
    const queries = recordNotesQueries();

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Filter by Title" }),
      "note 99",
    );

    // "Note 99" and "Note 990" to "Note 999".
    await waitFor(() => expect(status()).toHaveTextContent("11 notes"));
    expect(router.state.location.search).toBe("?title=note+99");
    // One request after the user paused typing, not one per key.
    expect(queries).toHaveLength(1);
    server.events.removeAllListeners();
  });

  it("searches title and content with the search box", async () => {
    await openNotes();

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search notes" }),
      "content of note 500",
    );

    await waitFor(() => expect(status()).toHaveTextContent("1 note"));
    expect(titles()).toEqual(["Note 500"]);
  });

  it("sorts by a column header, then reverses on the second click", async () => {
    const router = await openNotes();
    const titleHeader = () =>
      screen
        .getAllByRole("columnheader")
        .find((header) => header.textContent?.startsWith("Title"))!;

    await userEvent.click(within(titleHeader()).getByRole("button"));

    await waitFor(() =>
      expect(titleHeader()).toHaveAttribute("aria-sort", "ascending"),
    );
    expect(router.state.location.search).toBe("?sortBy=title&sortOrder=asc");
    await waitFor(() => expect(titles()[0]).toBe("Note 1"));
    expect(titles()[1]).toBe("Note 10");

    await userEvent.click(within(titleHeader()).getByRole("button"));

    await waitFor(() => expect(titles()[0]).toBe("Note 999"));
    expect(titleHeader()).toHaveAttribute("aria-sort", "descending");
  });

  it("changes the page size", async () => {
    const router = await openNotes("/notes?page=4");

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Rows per page" }),
      "50",
    );

    await waitFor(() =>
      expect(status()).toHaveTextContent("Showing 1–50 of 1,000 notes"),
    );
    expect(router.state.location.search).toBe("?pageSize=50");
  });

  it("restores the filter input from the URL on back and forward", async () => {
    const router = await openNotes("/notes?title=note+5");
    const titleFilter = () =>
      screen.getByRole("searchbox", { name: "Filter by Title" });
    expect(titleFilter()).toHaveValue("note 5");

    await userEvent.click(screen.getByRole("link", { name: "About" }));
    await screen.findByRole("heading", { name: "About", level: 1 });
    await router.navigate(-1);

    await waitFor(() => expect(titleFilter()).toHaveValue("note 5"));
  });

  it("clears the filter input when the URL drops the filter", async () => {
    await openNotes("/notes?title=note+5");
    const titleFilter = () =>
      screen.getByRole("searchbox", { name: "Filter by Title" });
    expect(titleFilter()).toHaveValue("note 5");

    // Same page, so the table stays mounted; only the URL changes.
    await userEvent.click(screen.getByRole("link", { name: "Notes" }));

    await waitFor(() => expect(titleFilter()).toHaveValue(""));
    await waitFor(() =>
      expect(status()).toHaveTextContent("Showing 1–20 of 1,000 notes"),
    );
  });
});
