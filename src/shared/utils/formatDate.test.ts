import { describe, expect, it } from "vitest";

import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats ISO dates as dd/mm/yyyy", () => {
    expect(formatDate("2026-11-10T08:00:00.000Z")).toBe("10/11/2026");
  });

  it("uses UTC, so late-evening UTC times keep their UTC date", () => {
    expect(formatDate("2026-01-31T23:30:00.000Z")).toBe("31/01/2026");
  });

  it("returns an empty string for invalid dates", () => {
    expect(formatDate("not a date")).toBe("");
  });
});
