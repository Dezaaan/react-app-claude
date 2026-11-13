import { delay, http, HttpResponse } from "msw";

import type { LoginCredentials } from "@/features/auth/types";
import { apiUrl } from "@/shared/api/httpClient";
import {
  getMockNotes,
  MOCK_PASSWORD,
  mockUser,
  ROLE_PERMISSIONS,
} from "./data";
import { queryNotes } from "./notesQuery";
import { mockSession } from "./session";

/** The backend's error body: { error: { code, message, details? } }. */
const apiError = (
  status: number,
  code: string,
  message: string,
  details?: unknown,
) => HttpResponse.json({ error: { code, message, details } }, { status });

const unauthorized = () =>
  apiError(401, "UNAUTHORIZED", "Authentication required");

/** GET /notes: one page, or the backend's 400 for an invalid query. */
const notesResponse = (request: Request) => {
  const result = queryNotes(getMockNotes(), new URL(request.url).searchParams);

  return result.ok
    ? HttpResponse.json(result.page)
    : apiError(400, "VALIDATION_ERROR", "Invalid request data", {
        formErrors: [],
        fieldErrors: result.fieldErrors,
      });
};

/** The logged-in user, with the mock session's role. */
const currentUser = (email = mockUser.email) => {
  const role = mockSession.getRole();
  return {
    user: { ...mockUser, email, role },
    permissions: ROLE_PERMISSIONS[role],
  };
};

/** Login and refresh: the user, their permissions and a new access token. */
const authResponse = (email = mockUser.email) =>
  HttpResponse.json({
    ...currentUser(email),
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
      ? HttpResponse.json(currentUser())
      : unauthorized(),
  ),

  // Any email works; the password must be MOCK_PASSWORD ("password").
  http.post(apiUrl("/auth/login"), async ({ request }) => {
    await delay(300);
    const { email, password } = (await request.json()) as LoginCredentials;

    if (!email || !password) {
      return apiError(400, "VALIDATION_ERROR", "Invalid request data", {
        formErrors: [],
        fieldErrors: {
          ...(!email && { email: ["Invalid email address"] }),
          ...(!password && {
            password: ["Too small: expected string to have >=1 characters"],
          }),
        },
      });
    }

    if (password !== MOCK_PASSWORD) {
      return apiError(401, "UNAUTHORIZED", "Invalid email or password");
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
    return notesResponse(request);
  }),
];

/**
 * Failure cases, layered on top of `handlers` in a test:
 * `server.use(...scenarios["notes-server-error"])`.
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

  // Logged in as a read-only "viewer": notes.view but not notes.edit.
  // Lasts until reset, so logging in again keeps the role.
  viewer: [
    http.post(
      apiUrl("/auth/refresh"),
      () => {
        mockSession.setRole("viewer");
        return authResponse();
      },
      { once: true },
    ),
  ],

  "notes-server-error": [
    http.get(apiUrl("/notes"), () =>
      apiError(500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred"),
    ),
  ],

  "notes-forbidden": [
    http.get(apiUrl("/notes"), () =>
      apiError(403, "FORBIDDEN", "Missing notes.view"),
    ),
  ],

  "notes-slow": [
    http.get(apiUrl("/notes"), async ({ request }) => {
      await delay(3000);
      return notesResponse(request);
    }),
  ],
};
