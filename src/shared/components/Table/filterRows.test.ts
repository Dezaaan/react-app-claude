import { describe, expect, it } from "vitest";

import { filterRows } from "@/shared/components/Table/filterRows";
import type { TableColumn } from "@/shared/components/Table/types";
import { formatDate } from "@/shared/utils/formatDate";

type Item = { id: string; name: string; note: string; createdAt: string };

const columns: TableColumn<Item>[] = [
  { id: "name", header: "Name", accessor: "name", searchable: true },
  { id: "note", header: "Note", accessor: "note", searchable: true },
  {
    id: "createdAt",
    header: "Created",
    accessor: "createdAt",
    searchable: true,
    render: (value) => formatDate(String(value)),
    filterValue: (value) => formatDate(String(value)),
  },
];

const items: Item[] = [
  {
    id: "a1",
    name: "Shopping list",
    note: "Milk and eggs",
    createdAt: "2026-11-10T08:00:00.000Z",
  },
  {
    id: "b2",
    name: "Meeting notes",
    note: "Discuss the roadmap",
    createdAt: "2025-01-02T08:00:00.000Z",
  },
];

const ids = (filters: Record<string, string>) =>
  filterRows(items, filters, columns).map((item) => item.id);

describe("filterRows", () => {
  it("returns the same array when no filter is active", () => {
    expect(filterRows(items, {}, columns)).toBe(items);
    expect(filterRows(items, { name: "   " }, columns)).toBe(items);
  });

  it("matches case-insensitively and ignores surrounding whitespace", () => {
    expect(ids({ name: "  SHOPPING " })).toEqual(["a1"]);
  });

  it("matches dates by their displayed dd/mm/yyyy value", () => {
    expect(ids({ createdAt: "10/11/2026" })).toEqual(["a1"]);
    expect(ids({ createdAt: "/2025" })).toEqual(["b2"]);
  });

  it("does not match dates by the raw ISO string", () => {
    expect(ids({ createdAt: "2026-11" })).toEqual([]);
  });

  it("requires every active filter to match", () => {
    expect(ids({ name: "notes", note: "roadmap" })).toEqual(["b2"]);
    expect(ids({ name: "notes", note: "milk" })).toEqual([]);
  });
});
