import { describe, expect, it } from "vitest";

import { notesQueryFromUrl } from "./notesQuery";

const query = (search: string) =>
  notesQueryFromUrl(new URLSearchParams(search));

describe("notesQueryFromUrl", () => {
  it("uses the backend's defaults for an empty URL", () => {
    expect(query("")).toEqual({
      page: 1,
      pageSize: 20,
      search: undefined,
      title: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("reads page, size, filters and sorting", () => {
    expect(
      query(
        "page=3&pageSize=50&search=milk&title=%20shop%20&sortBy=title&sortOrder=asc",
      ),
    ).toEqual({
      page: 3,
      pageSize: 50,
      search: "milk",
      title: "shop",
      sortBy: "title",
      sortOrder: "asc",
    });
  });

  it("falls back to defaults instead of sending what the API rejects", () => {
    expect(
      query("page=-2&pageSize=1000&sortBy=id&sortOrder=up&search=%20%20"),
    ).toMatchObject({
      page: 1,
      pageSize: 20,
      search: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });
});
