# Notes

A React app for browsing notes, with login and per-route permissions.

React 19, TypeScript, Vite, React Router 7 (data router), SCSS modules,
react-window for large lists, Vitest + Testing Library, MSW to mock the API in tests.

## Getting started

Requires Node 22.

```sh
npm ci
npm run dev
```

The app runs at http://localhost:5173 (the port is fixed: the backend only
accepts that origin). It needs the backend running; see
[Running against the backend](#running-against-the-backend).

There is no sign-up page yet, so create an account first:
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

## Running against the backend

1. Start the backend (`nodejs-app-claude`) with `CLIENT_ORIGIN=http://localhost:5173`.
2. If the backend isn't on port 3000, set `VITE_API_PROXY_TARGET` in
   `.env.local`.
3. `npm run dev` and open **http://localhost:5173**. Use `localhost`, not
   `127.0.0.1`: they are different sites, and the login cookie isn't shared.

The dev server forwards `/api` to the backend, so the browser sees a single
origin. In production, serve the frontend and API from the same parent
domain (see the backend README).

## Mock API (tests)

The tests answer API requests with [MSW](https://mswjs.io) in Node
(`src/mocks/handlers.ts`), so they need no backend. `scenarios` in the same
file holds the other cases (logged out, expired token, offline, server
error, forbidden, slow notes); a test turns one on with
`server.use(...scenarios["offline"])`.

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
  mocks/       MSW handlers and mock data for the tests
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
- Permissions come from the backend with login and refresh (`user` gets
  `notes.view` and `notes.edit`, `viewer` only `notes.view`). The frontend
  only uses them to show or hide things; the backend enforces them. Check
  permissions (`hasPermission`), never role names. A role change reaches a
  logged-in user at their next refresh (within 15 minutes).
- Long lists, two ways (both read the backend one page at a time):
  - **Numbered pages** (Notes): page, filters and sorting live in the URL
    (`/notes?page=2&title=shop&sortBy=title&sortOrder=asc`); the route
    loader fetches that page. Shared pieces: `Pagination`, sortable
    `Table` headers and `useTableUrlState`.
  - **Infinite scroll** (Home): the loader fetches the first page;
    `useInfiniteList` appends the next one when the list nears its end
    (one request at a time, duplicates skipped, cancelled on unmount).
- Styles: SCSS modules per component. Colors, sizes, spacing and fonts come
  from the CSS variables in `src/app/styles/tokens.css` (with dark-mode
  values), never hardcoded. `base.css` styles plain elements, including
  inputs and selects. Use the shared `Button` (`primary`, `secondary`,
  `danger`) instead of styling buttons per component.
- API errors become an `AppError` (`src/shared/errors`) with a code and a
  message that is safe to show to users.
