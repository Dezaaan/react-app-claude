import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { LOAD_TIMEOUT, renderApp as renderAt } from "@/test/utils";

// These tests mock only the network (via MSW), so each one runs the real
// chain: route -> loader -> API module -> httpClient -> AppError -> RouteError.

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
    expect(router.state.location.search).toBe("?redirectTo=%2Fabout");
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

  it("loads the page again when the user tries again", async () => {
    // Fails once, then the normal handler answers.
    server.use(
      http.get(
        apiUrl("/notes"),
        () => HttpResponse.json({ error: {} }, { status: 500 }),
        { once: true },
      ),
    );

    renderAt("/notes");
    await screen.findByRole("alert", {}, LOAD_TIMEOUT);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { name: "Notes", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a permission error when the API answers 403", async () => {
    server.use(...scenarios["notes-forbidden"]);

    renderAt("/notes");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("You don't have permission to access this page.");
    // Trying again wouldn't help.
    expect(
      screen.queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();
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
