import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { usePendingIndicator } from "@/shared/pending/pendingContext";
import { PageLayout } from "./PageLayout";

const Busy = ({ label }: { label: string }) => {
  const [isPending, setIsPending] = useState(false);
  usePendingIndicator(isPending);

  return (
    <button type="button" onClick={() => setIsPending((value) => !value)}>
      {label}
    </button>
  );
};

const renderLayout = () => {
  const router = createMemoryRouter([
    {
      element: <PageLayout />,
      children: [
        {
          index: true,
          element: (
            <>
              <Busy label="First" />
              <Busy label="Second" />
            </>
          ),
        },
      ],
    },
  ]);
  render(<RouterProvider router={router} />);
};

const progress = () =>
  screen.queryByRole("progressbar", { name: "Updating results" });

describe("PageLayout", () => {
  it("shows the loading bar while something on the page is pending", async () => {
    renderLayout();
    expect(progress()).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "First" }));

    expect(progress()).toBeInTheDocument();
    // Unlike navigation, the page stays usable and isn't marked busy.
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "false");

    await userEvent.click(screen.getByRole("button", { name: "First" }));

    expect(progress()).not.toBeInTheDocument();
  });

  it("keeps the bar until everything pending is done", async () => {
    renderLayout();

    await userEvent.click(screen.getByRole("button", { name: "First" }));
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    await userEvent.click(screen.getByRole("button", { name: "First" }));

    expect(progress()).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Second" }));

    expect(progress()).not.toBeInTheDocument();
  });
});
