import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mockPermissions, mockUser } from "@/mocks/data";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { clearSession, getSession } from "./session";

/** Counts requests to GET /auth/me while still answering normally. */
const countMeRequests = () => {
  const counter = { count: 0 };
  server.events.on("request:start", ({ request }) => {
    if (request.url === apiUrl("/auth/me")) counter.count += 1;
  });
  return counter;
};

describe("getSession", () => {
  it("returns the user with their permissions", async () => {
    await expect(getSession()).resolves.toEqual({
      user: mockUser,
      permissions: mockPermissions,
    });
  });

  it("returns null when logged out", async () => {
    server.use(...scenarios["logged-out"]);

    await expect(getSession()).resolves.toBeNull();
  });

  it("shares one request between concurrent and later callers", async () => {
    const requests = countMeRequests();

    await Promise.all([getSession(), getSession(), getSession()]);
    await getSession();

    expect(requests.count).toBe(1);
    server.events.removeAllListeners();
  });

  it("fetches again after clearSession()", async () => {
    const requests = countMeRequests();

    await getSession();
    clearSession();
    await getSession();

    expect(requests.count).toBe(2);
    server.events.removeAllListeners();
  });

  it("doesn't cache failures", async () => {
    server.use(
      http.get(apiUrl("/auth/me"), () => HttpResponse.error(), { once: true }),
    );

    await expect(getSession()).rejects.toThrow();
    await expect(getSession()).resolves.toMatchObject({ user: mockUser });
  });
});
