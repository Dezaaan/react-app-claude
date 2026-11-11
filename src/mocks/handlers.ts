import { delay, http, HttpResponse } from "msw";

import { apiUrl } from "@/shared/api/httpClient";
import { getMockNotes, mockPermissions, mockUser } from "./data";

/** The "happy path" backend used in development and tests. */
export const handlers = [
  http.get(apiUrl("/auth/me"), () => HttpResponse.json(mockUser)),

  http.get(apiUrl("/auth/permissions"), () =>
    HttpResponse.json(mockPermissions),
  ),

  http.get(apiUrl("/notes"), async () => {
    await delay(300);
    return HttpResponse.json(getMockNotes());
  }),
];

/**
 * Failure cases, layered on top of `handlers` with `worker.use()` /
 * `server.use()`. In the browser, add `?mock=<name>` to the URL,
 * e.g. http://localhost:5173/notes?mock=notes-server-error
 */
export const scenarios = {
  // GET /auth/me -> 401: the app treats this as "not logged in".
  "logged-out": [
    http.get(apiUrl("/auth/me"), () =>
      HttpResponse.json({ message: "Not authenticated" }, { status: 401 }),
    ),
  ],

  // No response at all, like being offline or the server being down.
  offline: [http.all(apiUrl("/*"), () => HttpResponse.error())],

  "notes-server-error": [
    http.get(apiUrl("/notes"), () =>
      HttpResponse.json(
        { message: "Database connection lost" },
        { status: 500 },
      ),
    ),
  ],

  "notes-forbidden": [
    http.get(apiUrl("/notes"), () =>
      HttpResponse.json({ message: "Missing notes.view" }, { status: 403 }),
    ),
  ],

  "notes-slow": [
    http.get(apiUrl("/notes"), async () => {
      await delay(3000);
      return HttpResponse.json(getMockNotes());
    }),
  ],
};

export type MockScenario = keyof typeof scenarios;

export const isMockScenario = (value: string | null): value is MockScenario =>
  value !== null && value in scenarios;
