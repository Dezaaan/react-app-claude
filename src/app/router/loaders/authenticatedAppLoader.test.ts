import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { mockUser } from "@/mocks/data";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { apiUrl } from "@/shared/api/httpClient";
import { loaderArgs } from "@/test/utils";
import { authenticatedAppLoader } from "./authenticatedAppLoader";

describe("authenticatedAppLoader", () => {
  it("returns the user and their permissions", async () => {
    server.use(
      http.get(apiUrl("/auth/permissions"), () =>
        HttpResponse.json(["notes.view"]),
      ),
    );

    await expect(authenticatedAppLoader(loaderArgs())).resolves.toEqual({
      user: mockUser,
      permissions: ["notes.view"],
    });
  });

  it("redirects to /login when there is no user", async () => {
    server.use(...scenarios["logged-out"]);
    let permissionsRequested = false;
    server.use(
      http.get(apiUrl("/auth/permissions"), () => {
        permissionsRequested = true;
        return HttpResponse.json([]);
      }),
    );

    const thrown = await authenticatedAppLoader(loaderArgs()).catch(
      (error) => error,
    );

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(302);
    expect(thrown.headers.get("Location")).toBe("/login");
    expect(permissionsRequested).toBe(false);
  });
});
