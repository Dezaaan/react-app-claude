import { delay, http, HttpResponse } from "msw";

import type { LoginCredentials } from "@/features/auth/types";
import { apiUrl } from "@/shared/api/httpClient";
import { getMockNotes, MOCK_PASSWORD, mockUser } from "./data";
import { mockSession } from "./session";

const unauthorized = () =>
  HttpResponse.json({ message: "Not authenticated" }, { status: 401 });

/** Login and refresh: the user and a new access token. */
const authResponse = (email = mockUser.email) =>
  HttpResponse.json({
    user: { ...mockUser, email },
    accessToken: mockSession.issueToken(),
    accessTokenExpiresIn: 900,
  });

/**
 * The "happy path" backend used in development and tests. Mirrors the real
 * API: the refresh "cookie" is `mockSession`, and every other route needs
 * `Authorization: Bearer <access token>`.
 */
export const handlers = [
  http.post(apiUrl("/auth/refresh"), () =>
    mockSession.isLoggedIn() ? authResponse() : unauthorized(),
  ),

  http.get(apiUrl("/auth/me"), ({ request }) =>
    mockSession.isAuthorized(request)
      ? HttpResponse.json({ user: mockUser })
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
    return authResponse(email);
  }),

  http.post(apiUrl("/auth/logout"), () => {
    mockSession.logOut();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(apiUrl("/notes"), async ({ request }) => {
    if (!mockSession.isAuthorized(request)) {
      return unauthorized();
    }

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
    http.post(
      apiUrl("/auth/refresh"),
      () => {
        mockSession.logOut();
        return unauthorized();
      },
      { once: true },
    ),
  ],

  // The access token expires before the next notes request: the app
  // refreshes it once and repeats the request, without the user noticing.
  "expired-token": [
    http.get(
      apiUrl("/notes"),
      () => {
        mockSession.expireToken();
        return unauthorized();
      },
      { once: true },
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
