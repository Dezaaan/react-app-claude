import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { MOCK_PASSWORD, mockUser } from "@/mocks/data";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { mockSession } from "@/mocks/session";
import { apiUrl } from "@/shared/api/httpClient";
import { LOAD_TIMEOUT, renderApp } from "@/test/utils";

// End-to-end auth flows on the real route tree; only the network is mocked.

const findPageHeading = (name: string) =>
  screen.findByRole("heading", { name, level: 1 }, LOAD_TIMEOUT);

const logIn = async (password = MOCK_PASSWORD) => {
  await userEvent.type(
    await screen.findByLabelText("Email", {}, LOAD_TIMEOUT),
    "user@example.com",
  );
  await userEvent.type(screen.getByLabelText("Password"), password);
  await userEvent.click(screen.getByRole("button", { name: "Log in" }));
};

/** The home page loads notes; keep the list small in tests. */
const useFewNotes = () =>
  server.use(
    http.get(apiUrl("/notes"), () =>
      HttpResponse.json({
        items: [],
        pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
      }),
    ),
  );

describe("login", () => {
  it("returns to the page the user originally asked for", async () => {
    mockSession.logOut();

    const router = renderApp("/about");
    await findPageHeading("Login");
    await logIn();

    expect(await findPageHeading("About")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/about");
  });

  it("shows an error for a wrong password and stays on the form", async () => {
    mockSession.logOut();

    const router = renderApp("/login");
    await logIn("wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password.",
    );
    expect(router.state.location.pathname).toBe("/login");
  });

  it("asks for both fields before calling the server", async () => {
    mockSession.logOut();
    let loginRequested = false;
    server.events.on("request:start", ({ request }) => {
      if (request.url === apiUrl("/auth/login")) loginRequested = true;
    });

    renderApp("/login");
    await screen.findByLabelText("Email", {}, LOAD_TIMEOUT);
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter your email and password.",
    );
    expect(loginRequested).toBe(false);
    server.events.removeAllListeners();
  });

  it("ignores redirects to other sites", async () => {
    mockSession.logOut();
    useFewNotes();

    const router = renderApp("/login?redirectTo=https://evil.example");
    await logIn();

    expect(await findPageHeading("Home")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it("skips the form when already logged in", async () => {
    useFewNotes();

    const router = renderApp("/login?redirectTo=%2Fabout");

    expect(await findPageHeading("About")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/about");
  });
});

describe("logout", () => {
  it("ends the session and shows the login page", async () => {
    const router = renderApp("/about");
    await findPageHeading("About");

    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(await findPageHeading("Login")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
    expect(mockSession.isLoggedIn()).toBe(false);
  });

  it("doesn't ask the server again whether we're logged in", async () => {
    renderApp("/about");
    await findPageHeading("About");
    let refreshed = false;
    server.events.on("request:start", ({ request }) => {
      if (request.url === apiUrl("/auth/refresh")) refreshed = true;
    });

    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));
    await findPageHeading("Login");

    expect(refreshed).toBe(false);
    server.events.removeAllListeners();
  });
});

/** Logged in, but allowed nothing (no current role does this). */
const withoutPermissions = () =>
  server.use(
    http.post(apiUrl("/auth/refresh"), () =>
      HttpResponse.json({
        user: mockUser,
        permissions: [],
        accessToken: mockSession.issueToken(),
        accessTokenExpiresIn: 900,
      }),
    ),
  );

describe("permissions", () => {
  it("hides links to routes the user can't open", async () => {
    withoutPermissions();

    renderApp("/about");
    await findPageHeading("About");

    const nav = within(screen.getByRole("navigation"));
    expect(nav.queryByRole("link", { name: "Notes" })).not.toBeInTheDocument();
    expect(nav.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("blocks the route without requesting its data", async () => {
    withoutPermissions();
    let notesRequested = false;
    server.events.on("request:start", ({ request }) => {
      if (request.url === apiUrl("/notes")) notesRequested = true;
    });

    renderApp("/notes");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("You don't have permission to access this page.");
    // Still inside the layout, so the user can navigate elsewhere.
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(notesRequested).toBe(false);
    server.events.removeAllListeners();
  });

  it("uses the permissions from the login response", async () => {
    mockSession.logOut();
    server.use(
      http.post(apiUrl("/auth/login"), () => {
        mockSession.logIn();
        return HttpResponse.json({
          user: mockUser,
          permissions: [],
          accessToken: mockSession.issueToken(),
          accessTokenExpiresIn: 900,
        });
      }),
    );

    renderApp("/about");
    await findPageHeading("Login");
    await logIn();
    await findPageHeading("About");

    const nav = within(screen.getByRole("navigation"));
    expect(nav.queryByRole("link", { name: "Notes" })).not.toBeInTheDocument();
  });

  it("lets a viewer read notes", async () => {
    server.use(...scenarios.viewer);

    renderApp("/notes");

    expect(await findPageHeading("Notes")).toBeInTheDocument();
    expect(
      await screen.findByRole("status", {}, LOAD_TIMEOUT),
    ).toHaveTextContent(/Showing 1–20 of/);
  });

  it("shows a message, without logging out, when the API refuses", async () => {
    // E.g. the user's role changed while they were logged in.
    server.use(...scenarios["notes-forbidden"]);

    const router = renderApp("/notes");

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("You don't have permission to access this page.");
    expect(router.state.location.pathname).toBe("/notes");
    expect(mockSession.isLoggedIn()).toBe(true);
  });
});

describe("expired access token", () => {
  it("refreshes it and repeats the request without the user noticing", async () => {
    server.use(...scenarios["expired-token"]);

    renderApp("/notes");

    expect(await findPageHeading("Notes")).toBeInTheDocument();
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    // The retry itself is tested in session.test.ts.
  });

  it("stays logged in when refreshing is rate limited", async () => {
    const router = renderApp("/notes");
    await findPageHeading("Notes");
    await screen.findByRole("status", {}, LOAD_TIMEOUT);

    // The token expires, and the refresh hits the auth rate limit.
    mockSession.expireToken();
    server.use(
      http.post(
        apiUrl("/auth/refresh"),
        () => HttpResponse.text("Too many requests", { status: 429 }),
        { once: true },
      ),
    );
    await userEvent.click(screen.getByRole("link", { name: "Page 2" }));

    expect(
      await screen.findByRole("alert", {}, LOAD_TIMEOUT),
    ).toHaveTextContent("Too many attempts");
    expect(router.state.location.pathname).toBe("/notes");
  });

  it("goes to the login page when the session has ended", async () => {
    server.use(
      http.get(
        apiUrl("/notes"),
        () => {
          // The token expired, and so did the session behind it.
          mockSession.logOut();
          return HttpResponse.json(
            { error: { code: "UNAUTHORIZED", message: "Token expired" } },
            { status: 401 },
          );
        },
        { once: true },
      ),
    );

    const router = renderApp("/notes");

    expect(await findPageHeading("Login")).toBeInTheDocument();
    expect(router.state.location.search).toBe("?redirectTo=%2Fnotes");
  });
});
