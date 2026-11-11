import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useNavigationItems } from "./useNavigationItems";

const labels = (placement: "nav" | "menu") =>
  renderHook(() => useNavigationItems(placement)).result.current.map(
    (route) => route.meta.navigation?.label,
  );

describe("useNavigationItems", () => {
  it("returns visible nav routes sorted by order", () => {
    expect(labels("nav")).toEqual(["Home", "Notes", "About", "Contact"]);
  });

  it("returns visible menu routes sorted by order", () => {
    expect(labels("menu")).toEqual(["Profile", "Settings"]);
  });
});
