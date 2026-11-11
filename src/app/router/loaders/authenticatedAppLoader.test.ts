import { describe, expect, it, vi } from "vitest";

import { authApi } from "@/features/auth/api/authApi";
import type { AuthUser } from "@/features/auth/types";
import { authenticatedAppLoader } from "./authenticatedAppLoader";

const user: AuthUser = { id: "1", email: "user@example.com", role: "user" };

describe("authenticatedAppLoader", () => {
  it("returns the user and their permissions", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(user);
    vi.spyOn(authApi, "getPermissions").mockResolvedValue(["notes.view"]);

    await expect(authenticatedAppLoader()).resolves.toEqual({
      user,
      permissions: ["notes.view"],
    });
  });

  it("redirects to /login when there is no user", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(null);
    const getPermissions = vi.spyOn(authApi, "getPermissions");

    const thrown = await authenticatedAppLoader().catch((error) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(302);
    expect(thrown.headers.get("Location")).toBe("/login");
    expect(getPermissions).not.toHaveBeenCalled();
  });
});
