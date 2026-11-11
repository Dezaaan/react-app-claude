import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "@/features/auth/context/AuthProvider";
import type { Permission } from "@/features/auth/types";
import { mockUser } from "@/mocks/data";
import { useNavigationItems } from "./useNavigationItems";

const labels = (
  placement: "nav" | "menu",
  permissions: Permission[] = ["notes.view"],
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider user={mockUser} permissions={permissions}>
      {children}
    </AuthProvider>
  );

  return renderHook(() => useNavigationItems(placement), {
    wrapper,
  }).result.current.map((route) => route.meta.navigation?.label);
};

describe("useNavigationItems", () => {
  it("returns visible nav routes sorted by order", () => {
    expect(labels("nav")).toEqual(["Home", "Notes", "About", "Contact"]);
  });

  it("returns visible menu routes sorted by order", () => {
    expect(labels("menu")).toEqual(["Profile", "Settings"]);
  });

  it("hides routes the user isn't allowed to open", () => {
    expect(labels("nav", [])).toEqual(["Home", "About", "Contact"]);
  });
});
