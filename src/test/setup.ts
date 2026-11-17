import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { clearSession } from "@/features/auth/session";
import { server } from "@/mocks/server";
import { mockSession } from "@/mocks/session";
import { queryClient } from "@/shared/query/queryClient";

// jsdom has no layout, so there is nothing to measure. react-window then
// keeps its defaultHeight, which is enough to render the first rows.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// A failed request fails the test's query at once, instead of after the
// app's retry and its delay. The retry policy has its own test.
queryClient.setDefaultOptions({
  ...queryClient.getDefaultOptions(),
  queries: { ...queryClient.getDefaultOptions().queries, retry: false },
});

// Fail loudly if a test hits an endpoint that has no mock.
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  server.resetHandlers();
  // Each test starts logged in, with nothing cached from the previous one.
  mockSession.reset();
  clearSession();
  queryClient.clear();
});

afterAll(() => server.close());
