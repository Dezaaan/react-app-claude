import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PageLayout } from "@/layouts/PageLayout/PageLayout";
import type { Note } from "../../types";
import { NotesTable } from "./NotesTable";

const notes: Note[] = Array.from({ length: 3 }, (_, index) => ({
  id: String(index + 1),
  title: `Note ${index + 1}`,
  content: `Content ${index + 1}`,
  createdAt: "2026-11-10T08:00:00.000Z",
}));

describe("NotesTable", () => {
  it("is a table with column headers, labelled filters and numbered rows", () => {
    render(<NotesTable notes={notes} />);

    const table = screen.getByRole("table", { name: "Notes" });
    // Two header rows (titles, filters) plus the data rows.
    expect(table).toHaveAttribute("aria-rowcount", "5");

    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((header) => header.textContent),
    ).toEqual(["ID", "Title", "Content", "Created At"]);

    expect(
      screen.getByRole("searchbox", { name: "Filter by Title" }),
    ).toBeInTheDocument();

    const rows = within(table).getAllByRole("row");
    const firstDataRow = rows[2];
    expect(firstDataRow).toHaveAttribute("aria-rowindex", "3");
    expect(
      within(firstDataRow).getByRole("cell", { name: "Note 1" }),
    ).toBeInTheDocument();
  });

  it("announces how many notes match the filters", async () => {
    render(<NotesTable notes={notes} />);
    expect(screen.getByRole("status")).toHaveTextContent("3 notes");

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Filter by Title" }),
      "Note 2",
    );

    expect(await screen.findByText("Showing 1 of 3 notes")).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "3");
  });

  it("shows the page loading bar until the filtered rows are ready", async () => {
    const router = createMemoryRouter([
      {
        element: <PageLayout />,
        children: [{ index: true, element: <NotesTable notes={notes} /> }],
      },
    ]);
    render(<RouterProvider router={router} />);
    const progress = () =>
      screen.queryByRole("progressbar", { name: "Updating results" });
    expect(progress()).not.toBeInTheDocument();

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Filter by Title" }),
      "Note 2",
    );

    expect(progress()).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("3 notes");

    await waitForElementToBeRemoved(progress);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Showing 1 of 3 notes",
    );
  });
});
