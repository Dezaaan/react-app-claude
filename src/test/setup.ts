import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { clearSession } from "@/features/auth/session";
import { server } from "@/mocks/server";
import { mockSession } from "@/mocks/session";

// Fail loudly if a test hits an endpoint that has no mock.
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  server.resetHandlers();
  // Each test starts logged in, with nothing cached from the previous one.
  mockSession.reset();
  clearSession();
});

afterAll(() => server.close());
