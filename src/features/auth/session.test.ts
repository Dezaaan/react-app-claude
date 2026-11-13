import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mockUser } from "@/mocks/data";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { mockSession } from "@/mocks/session";
import { accessToken } from "@/shared/api/accessToken";
import { apiUrl, httpClient } from "@/shared/api/httpClient";
import { testPermissions } from "@/test/utils";
import { clearSession, getSession, startSession } from "./session";

/** Counts requests to `path` while they're still answered normally. */
const countRequests = (path: string) => {
  const counter = { count: 0 };
  server.events.on("request:start", ({ request }) => {
    if (request.url === apiUrl(path)) counter.count += 1;
  });
  return counter;
};

describe("getSession", () => {
  it("restores the session from the refresh cookie", async () => {
    await expect(getSession()).resolves.toEqual({
      user: mockUser,
      permissions: testPermissions,
    });
    expect(accessToken.get()).toEqual(expect.any(String));
  });

  it("takes the permissions from the refresh response", async () => {
    server.use(...scenarios.viewer);

    await expect(getSession()).resolves.toEqual({
      user: { ...mockUser, role: "viewer" },
      permissions: ["notes.view"],
    });
  });

  it("picks up a role change at the next refresh", async () => {
    await expect(getSession()).resolves.toMatchObject({
      permissions: testPermissions,
    });

    // The token expires; meanwhile an operator made the user a viewer.
    mockSession.setRole("viewer");
    mockSession.expireToken();
    await httpClient.get("/auth/me");

    await expect(getSession()).resolves.toMatchObject({
      permissions: ["notes.view"],
    });
  });

  it("returns null when logged out", async () => {
    server.use(...scenarios["logged-out"]);

    await expect(getSession()).resolves.toBeNull();
    expect(accessToken.get()).toBeNull();
  });

  it("shares one refresh between concurrent and later callers", async () => {
    const refreshes = countRequests("/auth/refresh");

    await Promise.all([getSession(), getSession(), getSession()]);
    await getSession();

    expect(refreshes.count).toBe(1);
    server.events.removeAllListeners();
  });

  it("forgets the session and token on clearSession()", async () => {
    const refreshes = countRequests("/auth/refresh");

    await getSession();
    clearSession();
    expect(accessToken.get()).toBeNull();
    await getSession();

    expect(refreshes.count).toBe(2);
    server.events.removeAllListeners();
  });

  it("doesn't cache failures", async () => {
    server.use(
      http.post(apiUrl("/auth/refresh"), () => HttpResponse.error(), {
        once: true,
      }),
    );

    await expect(getSession()).rejects.toThrow();
    await expect(getSession()).resolves.toMatchObject({ user: mockUser });
  });

  it("uses the login response without asking the server again", async () => {
    const refreshes = countRequests("/auth/refresh");

    startSession({
      user: mockUser,
      permissions: ["notes.view"],
      accessToken: "from-login",
      accessTokenExpiresIn: 900,
    });

    await expect(getSession()).resolves.toEqual({
      user: mockUser,
      permissions: ["notes.view"],
    });
    expect(accessToken.get()).toBe("from-login");
    expect(refreshes.count).toBe(0);
    server.events.removeAllListeners();
  });
});

describe("expired access token", () => {
  it("is refreshed once for parallel requests, which are then repeated", async () => {
    await getSession();
    mockSession.expireToken();
    const refreshes = countRequests("/auth/refresh");

    const results = await Promise.all([
      httpClient.get("/auth/me"),
      httpClient.get("/auth/me"),
      httpClient.get("/auth/me"),
    ]);

    expect(results).toEqual(
      Array(3).fill({ user: mockUser, permissions: testPermissions }),
    );
    // Two refreshes with the same cookie would end the session (reuse).
    expect(refreshes.count).toBe(1);
    server.events.removeAllListeners();
  });

  it("fails with 401 and forgets the session when it can't be renewed", async () => {
    await getSession();
    mockSession.logOut();

    await expect(httpClient.get("/auth/me")).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(accessToken.get()).toBeNull();
  });

  it.each([
    [
      "rate limited",
      () =>
        HttpResponse.text("Too many requests, please try again later.", {
          status: 429,
        }),
      "TOO_MANY_REQUESTS",
    ],
    ["offline", () => HttpResponse.error(), "NETWORK_ERROR"],
  ])(
    "keeps the session when the refresh fails (%s), and tries again later",
    async (_case, refreshFailure, code) => {
      await getSession();
      mockSession.expireToken();
      server.use(
        http.post(apiUrl("/auth/refresh"), refreshFailure, { once: true }),
      );

      // The request fails with the refresh's error, not with "log in".
      await expect(httpClient.get("/auth/me")).rejects.toMatchObject({ code });
      await expect(getSession()).resolves.toMatchObject({ user: mockUser });

      // Once refreshing works again, so does the next request.
      await expect(httpClient.get("/auth/me")).resolves.toMatchObject({
        user: mockUser,
      });
    },
  );
});
