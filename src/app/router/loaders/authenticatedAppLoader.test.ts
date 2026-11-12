import { describe, expect, it } from "vitest";

import { mockUser } from "@/mocks/data";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { loaderArgs, testPermissions } from "@/test/utils";
import { authenticatedAppLoader } from "./authenticatedAppLoader";

describe("authenticatedAppLoader", () => {
  it("returns the user and their permissions", async () => {
    await expect(authenticatedAppLoader(loaderArgs())).resolves.toEqual({
      user: mockUser,
      permissions: testPermissions,
    });
  });

  it("redirects to /login when there is no session", async () => {
    server.use(...scenarios["logged-out"]);

    const thrown = await authenticatedAppLoader(loaderArgs("/notes")).catch(
      (error) => error,
    );

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(302);
    expect(thrown.headers.get("Location")).toBe("/login?redirectTo=%2Fnotes");
  });
});
