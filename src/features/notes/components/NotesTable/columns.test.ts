import { describe, expect, it } from "vitest";

import { filterRows } from "@/shared/components/Table/filterRows";
import type { Note } from "../../types";
import { columns } from "./columns";

const notes: Note[] = [
  {
    id: "a1",
    title: "Shopping list",
    content: "Milk and eggs",
    createdAt: "2026-11-10T08:00:00.000Z",
  },
  {
    id: "b2",
    title: "Meeting notes",
    content: "Discuss the roadmap",
    createdAt: "2025-01-02T08:00:00.000Z",
  },
];

const ids = (filters: Record<string, string>) =>
  filterRows(notes, filters, columns).map((note) => note.id);

// The notes columns run through the shared table filter, as on the page.
describe("filtering notes by column", () => {
  it("returns the same array when no filter is active", () => {
    expect(filterRows(notes, {}, columns)).toBe(notes);
    expect(filterRows(notes, { title: "   " }, columns)).toBe(notes);
  });

  it("matches case-insensitively and ignores surrounding whitespace", () => {
    expect(ids({ title: "  SHOPPING " })).toEqual(["a1"]);
  });

  it("matches dates by their displayed dd/mm/yyyy value", () => {
    expect(ids({ createdAt: "10/11/2026" })).toEqual(["a1"]);
    expect(ids({ createdAt: "/2025" })).toEqual(["b2"]);
  });

  it("does not match dates by the raw ISO string", () => {
    expect(ids({ createdAt: "2026-11" })).toEqual([]);
  });

  it("requires every active filter to match", () => {
    expect(ids({ title: "notes", content: "roadmap" })).toEqual(["b2"]);
    expect(ids({ title: "notes", content: "milk" })).toEqual([]);
  });
});
