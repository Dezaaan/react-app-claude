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

The app runs at http://localhost:5173. In development the API is mocked
(see [Mock API](#mock-api)), so no backend is needed. Log in with any email
and the password `password`.

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

| Variable         | Default | Meaning                                                              |
| ---------------- | ------- | -------------------------------------------------------------------- |
| `VITE_API_URL`   | `/api`  | Base URL of the API. Use a full URL for a backend on another origin. |
| `VITE_API_MOCKS` | `true`  | Development only. `false` sends requests to the real API instead.    |

## Mock API

In development, [MSW](https://mswjs.io) answers API requests in the browser
(`src/mocks/handlers.ts`), using the service worker in
`public/mockServiceWorker.js`. The tests use the same handlers in Node.

Add `?mock=<scenario>` to any URL to try other cases until the next reload:

| Scenario             | Effect                                       |
| -------------------- | -------------------------------------------- |
| `logged-out`         | Starts logged out (login page)               |
| `no-permissions`     | Logged in without `notes.view`               |
| `offline`            | Every request fails as if there's no network |
| `notes-server-error` | Loading notes fails with a 500               |
| `notes-forbidden`    | Loading notes fails with a 403               |
| `notes-slow`         | Loading notes takes a few seconds            |

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
- API errors become an `AppError` (`src/shared/errors`) with a code and a
  message that is safe to show to users.
