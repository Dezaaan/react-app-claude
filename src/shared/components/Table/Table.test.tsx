import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { PageLayout } from "@/layouts/PageLayout/PageLayout";
import { Table } from "@/shared/components/Table/Table";
import type { TableColumn, TableSort } from "@/shared/components/Table/types";
import { useTableFilters } from "@/shared/components/Table/useTableFilters";

type Item = { id: string; name: string };

const columns: TableColumn<Item>[] = [
  { id: "id", header: "ID", accessor: "id" },
  {
    id: "name",
    header: "Name",
    accessor: "name",
    searchable: true,
    sortable: true,
  },
];

const items: Item[] = [1, 2, 3].map((n) => ({
  id: String(n),
  name: `Item ${n}`,
}));

/** A table whose rows are all loaded: filtered in the browser. */
const ClientTable = () => {
  const { filters, onFilterChange, rows } = useTableFilters(items, columns);

  return (
    <Table aria-label="Items" rowCount={rows.length}>
      <Table.Header
        columns={columns}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <Table.Body data={rows} columns={columns} />
    </Table>
  );
};

const filterByName = (text: string) =>
  userEvent.type(
    screen.getByRole("searchbox", { name: "Filter by Name" }),
    text,
  );

describe("Table", () => {
  it("is a table with column headers, labelled filters and numbered rows", () => {
    render(<ClientTable />);

    const table = screen.getByRole("table", { name: "Items" });
    // Two header rows (titles, filters) plus the data rows.
    expect(table).toHaveAttribute("aria-rowcount", "5");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((header) => header.textContent),
    ).toEqual(["ID", "Name"]);
    expect(
      screen.getByRole("searchbox", { name: "Filter by Name" }),
    ).toBeInTheDocument();

    const firstDataRow = within(table).getAllByRole("row")[2];
    expect(firstDataRow).toHaveAttribute("aria-rowindex", "3");
    expect(
      within(firstDataRow).getByRole("cell", { name: "Item 1" }),
    ).toBeInTheDocument();
  });

  it("numbers rows across pages with firstRowIndex", () => {
    render(
      <Table aria-label="Items" rowCount={43}>
        <Table.Header columns={columns} />
        <Table.Body data={items} columns={columns} firstRowIndex={40} />
      </Table>,
    );

    // Row 41 of the list, after the two header rows.
    expect(screen.getAllByRole("row")[2]).toHaveAttribute(
      "aria-rowindex",
      "43",
    );
  });

  it("filters rows in the browser and says so when none match", async () => {
    render(<ClientTable />);

    await filterByName("Item 2");
    await waitFor(() =>
      expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "3"),
    );

    await userEvent.clear(
      screen.getByRole("searchbox", { name: "Filter by Name" }),
    );
    await filterByName("nothing like this");
    expect(
      await screen.findByRole("cell", { name: "No results" }),
    ).toBeInTheDocument();
  });

  it("shows the page loading bar until the filtered rows are ready", async () => {
    const router = createMemoryRouter([
      {
        element: <PageLayout />,
        children: [{ index: true, element: <ClientTable /> }],
      },
    ]);
    render(<RouterProvider router={router} />);
    const progress = () =>
      screen.queryByRole("progressbar", { name: "Updating results" });

    await filterByName("Item 2");

    expect(progress()).toBeInTheDocument();
    await waitForElementToBeRemoved(progress);
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "3");
  });

  it("marks the sorted column and reports header clicks", async () => {
    const onSortChange = vi.fn();
    const sort: TableSort = { columnId: "name", order: "asc" };
    render(
      <Table aria-label="Items">
        <Table.Header
          columns={columns}
          sort={sort}
          onSortChange={onSortChange}
        />
        <Table.Body data={items} columns={columns} />
      </Table>,
    );

    const [idHeader, nameHeader] = screen.getAllByRole("columnheader");
    expect(idHeader).not.toHaveAttribute("aria-sort");
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    await userEvent.click(within(nameHeader).getByRole("button"));

    expect(onSortChange).toHaveBeenCalledWith("name");
  });

  it("leaves room above the body's scrollbar, and none without one", async () => {
    // jsdom has no layout: pretend the rows overflow and a 15px scrollbar
    // takes space inside the body.
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(1000);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(985);
    render(<ClientTable />);
    const scrollbarWidth = () =>
      screen
        .getByRole("table")
        .style.getPropertyValue("--table-scrollbar-width");

    expect(scrollbarWidth()).toBe("15px");

    // With no rows there is no scrolling list, so no scrollbar.
    await filterByName("nothing like this");
    await screen.findByRole("cell", { name: "No results" });

    expect(scrollbarWidth()).toBe("0px");
  });
});
