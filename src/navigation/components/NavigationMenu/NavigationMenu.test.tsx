import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { NavigationMenu } from "./NavigationMenu";

const renderMenu = () =>
  render(
    <MemoryRouter>
      <p>Outside</p>
      <NavigationMenu />
    </MemoryRouter>,
  );

const trigger = () => screen.getByRole("button", { name: "Open menu" });

describe("NavigationMenu", () => {
  it("opens with the menu routes, in order", async () => {
    renderMenu();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger());

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "Settings",
    ]);
  });

  it("closes after a menu item is clicked", async () => {
    renderMenu();
    await userEvent.click(trigger());

    await userEvent.click(screen.getByRole("link", { name: "Profile" }));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when clicking outside", async () => {
    renderMenu();
    await userEvent.click(trigger());

    await userEvent.click(screen.getByText("Outside"));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
