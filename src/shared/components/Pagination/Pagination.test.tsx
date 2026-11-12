import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { getPageItems } from "./getPageItems";
import { Pagination } from "./Pagination";

describe("getPageItems", () => {
  it.each([
    [1, 1, [1]],
    [1, 5, [1, 2, "gap", 5]],
    [3, 5, [1, 2, 3, 4, 5]],
    [6, 20, [1, "gap", 5, 6, 7, "gap", 20]],
    // A gap would hide just one page: show the page instead.
    [4, 20, [1, 2, 3, 4, 5, "gap", 20]],
    [20, 20, [1, "gap", 19, 20]],
  ])("page %i of %i -> %j", (page, total, expected) => {
    expect(getPageItems(page, total)).toEqual(expected);
  });
});

const renderPagination = (page: number, totalPages: number) =>
  render(
    <MemoryRouter>
      <Pagination
        label="Notes pages"
        page={page}
        totalPages={totalPages}
        hrefForPage={(n) => `/notes?page=${n}`}
      />
    </MemoryRouter>,
  );

describe("Pagination", () => {
  it("links to the neighbouring pages and marks the current one", () => {
    renderPagination(6, 20);

    const nav = within(screen.getByRole("navigation", { name: "Notes pages" }));
    expect(nav.getByRole("link", { name: "Page 6" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(nav.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/notes?page=5",
    );
    expect(nav.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/notes?page=7",
    );
  });

  it("has no Previous link on the first page, no Next on the last", () => {
    renderPagination(1, 3);
    expect(screen.queryByRole("link", { name: "Previous" })).toBeNull();

    renderPagination(3, 3);
    expect(screen.queryAllByRole("link", { name: "Next" })).toHaveLength(1);
  });

  it("renders nothing for a single page", () => {
    renderPagination(1, 1);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
