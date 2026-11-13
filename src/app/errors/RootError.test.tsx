import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { RootError } from "./RootError";

const Broken = () => {
  throw new Error("Bug while rendering");
};

describe("RootError", () => {
  it("replaces the app when rendering fails, and offers a reload", () => {
    // React logs the caught error; keep the test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
    const router = createMemoryRouter([
      { path: "/", element: <Broken />, errorElement: <RootError /> },
    ]);

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    // The bug's own message isn't shown to the user.
    expect(screen.getByRole("alert")).not.toHaveTextContent("Bug while");
    expect(
      screen.getByRole("button", { name: "Reload page" }),
    ).toBeInTheDocument();
  });
});
