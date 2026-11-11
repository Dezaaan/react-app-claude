import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { appRoutes } from "./appRoutes";

// These tests mock only the network (via MSW), so each one runs the real
// chain: route -> loader -> API module -> httpClient -> AppError -> RouteError.

// Lazy pages are imported on first render, which can take a moment.
const LOAD_TIMEOUT = { timeout: 5000 };

const renderAt = (path: string) => {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
};

describe("app routes", () => {
  it("renders an application page inside the main layout", async () => {
    renderAt("/about");

    expect(
      await screen.findByRole(
        "heading",
        { name: "About", level: 1 },
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("redirects to the login page when the server answers 401", async () => {
    server.use(...scenarios["logged-out"]);

    const router = renderAt("/about");

    expect(
      await screen.findByRole(
        "heading",
        { name: "Login", level: 1 },
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
  });

  it("shows a network error when the server can't be reached", async () => {
    server.use(...scenarios.offline);

    renderAt("/about");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("Unable to connect to the server.");
  });

  it("shows a page's server error inside the layout", async () => {
    server.use(...scenarios["notes-server-error"]);

    renderAt("/notes");

    const alert = await screen.findByRole("alert", {}, LOAD_TIMEOUT);
    expect(alert).toHaveTextContent(
      "The server ran into a problem. Please try again later.",
    );
    // The server's internal message stays out of the UI.
    expect(alert).not.toHaveTextContent("Database connection lost");
    // The error is scoped to the page, so the navigation stays usable.
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("shows a permission error when the API answers 403", async () => {
    server.use(...scenarios["notes-forbidden"]);

    renderAt("/notes");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("You don't have permission to access this page.");
  });

  it("renders the not-found page for unknown paths", async () => {
    renderAt("/does-not-exist");

    expect(
      await screen.findByRole(
        "heading",
        { name: "Page Not Found" },
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
  });
});
