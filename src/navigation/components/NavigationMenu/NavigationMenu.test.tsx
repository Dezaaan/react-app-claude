import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderWithAuth } from "@/test/utils";
import { NavigationMenu } from "./NavigationMenu";

const renderMenu = () =>
  renderWithAuth(
    <>
      <p>Outside</p>
      <NavigationMenu />
    </>,
  );

const trigger = () => screen.getByRole("button", { name: "Open menu" });

describe("NavigationMenu", () => {
  it("opens with the user, the menu routes in order, and Log out", async () => {
    renderMenu();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger());

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "Settings",
      "Log out",
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

  it("closes on Escape and puts focus back on the menu button", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Profile" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });
});
