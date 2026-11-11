import { describe, expect, it } from "vitest";

import { loginUrl, safeRedirect } from "./redirects";

describe("safeRedirect", () => {
  it.each(["/notes", "/notes?page=2", "/about#team"])(
    "allows the in-app path %j",
    (path) => {
      expect(safeRedirect(path)).toBe(path);
    },
  );

  it.each([
    ["an absolute URL", "https://evil.example"],
    ["a protocol-relative URL", "//evil.example"],
    ["a backslash trick", "/\\evil.example"],
    ["a relative path", "notes"],
    ["javascript:", "javascript:alert(1)"],
    ["the login page", "/login"],
    ["the login page with params", "/login?redirectTo=/notes"],
    ["an empty value", ""],
  ])("falls back to home for %s", (_, target) => {
    expect(safeRedirect(target)).toBe("/");
  });

  it("falls back for missing or non-string values", () => {
    expect(safeRedirect(null)).toBe("/");
    expect(safeRedirect(undefined)).toBe("/");
    expect(safeRedirect(new File([], "x"))).toBe("/");
  });
});

describe("loginUrl", () => {
  it("adds where to return to", () => {
    expect(loginUrl("/notes?page=2")).toBe(
      "/login?redirectTo=%2Fnotes%3Fpage%3D2",
    );
  });

  it("leaves it out for home", () => {
    expect(loginUrl("/")).toBe("/login");
    expect(loginUrl()).toBe("/login");
  });
});
