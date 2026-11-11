import { delay, http, HttpResponse } from "msw";

import type { LoginCredentials } from "@/features/auth/types";
import { apiUrl } from "@/shared/api/httpClient";
import { getMockNotes, MOCK_PASSWORD, mockPermissions, mockUser } from "./data";
import { mockSession } from "./session";

const unauthorized = () =>
  HttpResponse.json({ message: "Not authenticated" }, { status: 401 });

/** The "happy path" backend used in development and tests. */
export const handlers = [
  http.get(apiUrl("/auth/me"), () =>
    mockSession.isLoggedIn() ? HttpResponse.json(mockUser) : unauthorized(),
  ),

  http.get(apiUrl("/auth/permissions"), () =>
    mockSession.isLoggedIn()
      ? HttpResponse.json(mockPermissions)
      : unauthorized(),
  ),

  // Any email works; the password must be MOCK_PASSWORD ("password").
  http.post(apiUrl("/auth/login"), async ({ request }) => {
    await delay(300);
    const { email, password } = (await request.json()) as LoginCredentials;

    if (!email || !password) {
      return HttpResponse.json(
        {
          message: "Email and password are required.",
          errors: {
            ...(!email && { email: ["Email is required."] }),
            ...(!password && { password: ["Password is required."] }),
          },
        },
        { status: 422 },
      );
    }

    if (password !== MOCK_PASSWORD) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    mockSession.logIn();
    return HttpResponse.json({ ...mockUser, email });
  }),

  http.post(apiUrl("/auth/logout"), () => {
    mockSession.logOut();
    return new HttpResponse(null, { status: 204 });
  }),

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
  // Start logged out. Ends the mock session once, then the normal handlers
  // take over, so logging in from the form works afterwards.
  "logged-out": [
    http.get(
      apiUrl("/auth/me"),
      () => {
        mockSession.logOut();
        return unauthorized();
      },
      { once: true },
    ),
  ],

  // Logged in, but allowed nothing: the Notes link disappears and /notes
  // shows the permission error.
  "no-permissions": [
    http.get(apiUrl("/auth/permissions"), () => HttpResponse.json([])),
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
