# Notes

A React app for browsing notes, with login and per-route permissions.

React 19, TypeScript, Vite, React Router 7 (data router), SCSS modules,
react-window for large lists, Vitest + Testing Library, MSW for the mock API.

## Getting started

Requires Node 22.

```sh
npm ci
npm run dev
```

The app runs at http://localhost:5173 (the port is fixed: the backend only
accepts that origin). In development the API is mocked
(see [Mock API](#mock-api)), so no backend is needed. Log in with any email
and the password `password`.

Against the real backend, sign up first (there is no sign-up page yet):
`POST /api/v1/auth/register` with `{ "email", "password" }`.

## Scripts

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start the dev server                          |
| `npm run build`      | Type-check and build for production (`dist/`) |
| `npm run preview`    | Serve the production build locally            |
| `npm run lint`       | Run ESLint                                    |
| `npm test`           | Run the tests once                            |
| `npm run test:watch` | Run the tests on every change                 |

CI (GitHub Actions) runs lint, tests and build on every pull request.

## Configuration

Copy `.env.example` to `.env.local` to change these:

| Variable                | Default                 | Meaning                                                              |
| ----------------------- | ----------------------- | -------------------------------------------------------------------- |
| `VITE_API_URL`          | `/api/v1`               | Base URL of the API. Use a full URL for a backend on another origin. |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Development only. Where the dev server forwards `/api` requests.     |
| `VITE_API_MOCKS`        | `true`                  | Development only. `false` sends requests to the real API instead.    |

## Running against the backend

1. Start the backend (`nodejs-app-claude`) with `CLIENT_ORIGIN=http://localhost:5173`.
2. Create `.env.local` with `VITE_API_MOCKS=false` (and `VITE_API_PROXY_TARGET`
   if the backend isn't on port 3000).
3. `npm run dev` and open **http://localhost:5173**. Use `localhost`, not
   `127.0.0.1`: they are different sites, and the login cookie isn't shared.

The dev server forwards `/api` to the backend, so the browser sees a single
origin. In production, serve the frontend and API from the same parent
domain (see the backend README).

## Mock API

In development, [MSW](https://mswjs.io) answers API requests in the browser
(`src/mocks/handlers.ts`), using the service worker in
`public/mockServiceWorker.js`. The tests use the same handlers in Node.

Add `?mock=<scenario>` to any URL to try other cases until the next reload:

| Scenario             | Effect                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `logged-out`         | Starts logged out (login page)                                                           |
| `expired-token`      | The access token expires before the next notes request; the app refreshes it and retries |
| `offline`            | Every request fails as if there's no network                                             |
| `notes-server-error` | Loading notes fails with a 500                                                           |
| `notes-forbidden`    | Loading notes fails with a 403                                                           |
| `notes-slow`         | Loading notes takes a few seconds                                                        |

## Project structure

```
src/
  app/         App shell: router, route config, error screens
  features/    Feature code (auth, notes): API calls, loaders, components
  layouts/     Main layout (header, footer) and the page layout
  navigation/  Header links and user menu, built from the route config
  pages/       One folder per route; pages compose feature components
  shared/      Code with no feature knowledge: API client, errors,
               Table, Modal, List, hooks, utils
  mocks/       MSW handlers and mock data
  test/        Test setup and helpers
```

Conventions:

- Import with `@/…` (maps to `src/`) for anything outside the current
  folder. ESLint rejects `../` imports.
- `shared/` must not import from `features/`, `pages/` or `app/`.
- Routes are declared in `src/app/router/route-config.ts`: path, page,
  loader, required permission and navigation entry. Pages load with the
  route's `lazy`, in parallel with its loader.
- Login: the access token lives in memory only (`shared/api/accessToken.ts`);
  on page load the session is restored with the refresh cookie. When a
  request gets 401, `httpClient` refreshes once and repeats it
  (`features/auth/session.ts`).
- Permissions come from `authApi.getPermissions`. The backend doesn't send
  any yet, so every logged-in user gets `notes.view` and `notes.edit`.
- Long lists, two ways (both read the backend one page at a time):
  - **Numbered pages** (Notes): page, filters and sorting live in the URL
    (`/notes?page=2&title=shop&sortBy=title&sortOrder=asc`); the route
    loader fetches that page. Shared pieces: `Pagination`, sortable
    `Table` headers and `useTableUrlState`.
  - **Infinite scroll** (Home): the loader fetches the first page;
    `useInfiniteList` appends the next one when the list nears its end
    (one request at a time, duplicates skipped, cancelled on unmount).
- API errors become an `AppError` (`src/shared/errors`) with a code and a
  message that is safe to show to users.
