import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { NavigationItem } from "./NavigationItem";

const renderAt = (path: string, activeClassName?: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NavigationItem to="/">Home</NavigationItem>
      <NavigationItem to="/notes" activeClassName={activeClassName}>
        Notes
      </NavigationItem>
    </MemoryRouter>,
  );

describe("NavigationItem", () => {
  it("highlights only the link of the current page", () => {
    renderAt("/notes");

    expect(screen.getByRole("link", { name: "Notes" })).toHaveClass("active");
    // "/" would match every page without `end`.
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass(
      "active",
    );
  });

  it("uses activeClassName instead of the default when given", () => {
    renderAt("/notes", "menuActive");

    const link = screen.getByRole("link", { name: "Notes" });
    expect(link).toHaveClass("menuActive");
    expect(link).not.toHaveClass("active");
  });
});
