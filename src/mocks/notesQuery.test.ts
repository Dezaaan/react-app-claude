import { describe, expect, it } from "vitest";

import type { Note } from "@/features/notes/types";
import { queryNotes } from "./notesQuery";

// The mock must behave like the backend, or tests prove the wrong thing.

const note = (n: number, title = `Note ${n}`, content = `Body ${n}`): Note => ({
  id: String(n),
  title,
  content,
  createdAt: new Date(Date.UTC(2026, 0, n)).toISOString(),
  updatedAt: new Date(Date.UTC(2026, 0, 30 - n)).toISOString(),
});

const notes = Array.from({ length: 25 }, (_, i) => note(i + 1));

const run = (query: string, data = notes) => {
  const result = queryNotes(data, new URLSearchParams(query));
  if (!result.ok) throw new Error(JSON.stringify(result.fieldErrors));
  return result.page;
};

const ids = (query: string, data?: Note[]) =>
  run(query, data).items.map((n) => n.id);

describe("mock GET /notes", () => {
  it("defaults to page 1 of 20, newest first", () => {
    const page = run("");

    expect(page.items).toHaveLength(20);
    expect(page.items[0].id).toBe("25");
    expect(page.pagination).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 25,
      totalPages: 2,
    });
  });

  it("returns later pages, and an empty page past the end", () => {
    expect(ids("page=2&pageSize=10&sortOrder=asc")).toEqual([
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ]);
    expect(ids("page=9")).toEqual([]);
  });

  it("searches title or content, case-insensitively", () => {
    const data = [
      note(1, "Shopping", "milk"),
      note(2, "Work", "Buy MILK"),
      note(3, "Milkshake", "x"),
    ];

    expect(ids("search=milk&sortOrder=asc", data)).toEqual(["1", "2", "3"]);
    expect(ids("title=MILK", data)).toEqual(["3"]);
  });

  it("sorts by title and by updatedAt", () => {
    expect(ids("sortBy=title&sortOrder=asc&pageSize=3")).toEqual([
      "1",
      "10",
      "11",
    ]);
    // updatedAt runs the other way round from createdAt in this data.
    expect(ids("sortBy=updatedAt&pageSize=1")).toEqual(["1"]);
  });

  it("rejects what the backend rejects", () => {
    const result = queryNotes(
      notes,
      new URLSearchParams("pageSize=101&page=0"),
    );

    expect(result.ok).toBe(false);
    expect(!result.ok && Object.keys(result.fieldErrors).sort()).toEqual([
      "page",
      "pageSize",
    ]);
  });
});
