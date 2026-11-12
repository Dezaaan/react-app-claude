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

  describe("while the next route loads", () => {
    const renderWithSlowLoader = () => {
      let finish = () => {};
      const router = createMemoryRouter([
        {
          element: <PageLayout />,
          children: [
            {
              path: "/",
              element: <p>Page</p>,
              // Resolves at once the first time, then waits for finish().
              loader: ({ request }) =>
                new URL(request.url).search
                  ? new Promise((resolve) => {
                      finish = () => resolve(null);
                    })
                  : null,
            },
            {
              path: "/other",
              element: <p>Other</p>,
              loader: () =>
                new Promise((resolve) => {
                  finish = () => resolve(null);
                }),
            },
          ],
        },
      ]);
      render(<RouterProvider router={router} />);
      return { router, finish: () => finish() };
    };

    const content = () => screen.getByRole("main").lastElementChild!;

    it("dims the page when leaving it", async () => {
      const { router, finish } = renderWithSlowLoader();
      await screen.findByText("Page");

      void router.navigate("/other");

      expect(
        await screen.findByRole("progressbar", { name: "Loading page" }),
      ).toBeInTheDocument();
      expect(content()).toHaveClass("loading");
      finish();
    });

    it("keeps the page usable for new results on the same page", async () => {
      const { router, finish } = renderWithSlowLoader();
      await screen.findByText("Page");

      void router.navigate("/?page=2");

      expect(
        await screen.findByRole("progressbar", { name: "Updating results" }),
      ).toBeInTheDocument();
      expect(content()).not.toHaveClass("loading");
      expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");
      finish();
    });
  });
});
