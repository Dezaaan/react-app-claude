import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/app/errors/AppError";
import { ERROR_CODES } from "@/app/errors/errorCodes";
import { authApi } from "@/features/auth/api/authApi";
import { notesApi } from "@/features/notes/api/notesApi";
import { appRoutes } from "./appRoutes";

// Lazy pages are imported on first render, which can take a moment.
const LOAD_TIMEOUT = { timeout: 5000 };

const renderAt = (path: string) => {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
};

describe("app routes", () => {
  beforeEach(() => {
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue({
      id: "1",
      email: "user@example.com",
      role: "user",
    });
    vi.spyOn(authApi, "getPermissions").mockResolvedValue([]);
  });

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

  it("redirects to the login page when there is no user", async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(null);

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

  it("shows a network error when the user can't be loaded", async () => {
    vi.mocked(authApi.getCurrentUser).mockRejectedValue(
      new TypeError("Failed to fetch"),
    );

    renderAt("/about");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("Unable to connect to the server.");
  });

  it("shows a page's loader error inside the layout", async () => {
    vi.spyOn(notesApi, "getNotes").mockRejectedValue(
      new AppError(
        "Failed to fetch notes",
        ERROR_CODES.SERVER_ERROR,
        500,
        "Unable to load your notes.",
      ),
    );

    renderAt("/notes");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("Unable to load your notes.");
    // The error is scoped to the page, so the navigation stays usable.
    expect(screen.getByRole("navigation")).toBeInTheDocument();
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
