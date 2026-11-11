import { describe, expect, it } from "vitest";

import { canAccess } from "./access";

describe("canAccess", () => {
  it("allows any logged-in user when there's no requirement", () => {
    expect(canAccess([])).toBe(true);
  });

  it("requires the named permission", () => {
    const access = { type: "permission", permission: "notes.view" } as const;

    expect(canAccess(["notes.view"], access)).toBe(true);
    expect(canAccess(["notes.edit"], access)).toBe(false);
    expect(canAccess([], access)).toBe(false);
  });
});
