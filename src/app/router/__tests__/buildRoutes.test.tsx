import { render, screen } from "@testing-library/react";
import {
  Outlet,
  RouterProvider,
  createMemoryRouter,
  useLoaderData,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { LOAD_TIMEOUT } from "@/test/utils";
import { buildRoutes } from "@/app/router/buildRoutes";
import type { RouteAccess, RouteConfig } from "@/app/router/types";
import { PageContent } from "@/shared/content/PageContent";

// The mock session is logged in with notes.view and notes.edit, but not
// users.view.

const heading = (text: string) => () => <h1>{text}</h1>;
const page = (component: () => React.ReactNode) => async () => ({
  default: component,
});

const NoteDetails = () => {
  const { id } = useLoaderData() as { id: string };
  return <h1>Note {id}</h1>;
};

const SettingsLayout = () => (
  <>
    <h1>Settings</h1>
    <Outlet />
  </>
);

const render_ = (path: string, routes: RouteConfig[]) =>
  render(
    <RouterProvider
      router={createMemoryRouter(buildRoutes(routes, { guarded: true }), {
        initialEntries: [path],
      })}
    />,
  );

const notesRoutes = (
  detailsLoader = vi.fn(({ params }) => params),
  access: RouteAccess = { type: "permission", permission: "notes.view" },
): RouteConfig[] => [
  {
    // No page of its own: the list and the details are separate screens.
    path: "/notes",
    layout: "application",
    meta: { title: "Notes", access },
    children: [
      {
        index: true,
        page: page(heading("All notes")),
        meta: { title: "Notes" },
      },
      {
        path: ":id",
        page: page(NoteDetails),
        loader: detailsLoader,
        meta: { title: "Note" },
      },
    ],
  },
];

describe("buildRoutes", () => {
  it("shows the index child at the parent's path", async () => {
    render_("/notes", notesRoutes());

    expect(
      await screen.findByRole("heading", { name: "All notes" }, LOAD_TIMEOUT),
    ).toBeInTheDocument();
  });

  it("resolves child paths relative to the parent", async () => {
    render_("/notes/42", notesRoutes());

    expect(
      await screen.findByRole("heading", { name: "Note 42" }, LOAD_TIMEOUT),
    ).toBeInTheDocument();
  });

  it("renders a child inside a parent that has a page", async () => {
    render_("/settings/profile", [
      {
        path: "/settings",
        layout: "application",
        page: page(SettingsLayout),
        meta: { title: "Settings" },
        children: [
          {
            path: "profile",
            page: page(heading("Profile")),
            meta: { title: "Profile" },
          },
        ],
      },
    ]);

    expect(
      await screen.findByRole("heading", { name: "Settings" }, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Profile" }, LOAD_TIMEOUT),
    ).toBeInTheDocument();
  });

  it("applies a parent's access requirement to its children", async () => {
    // Loaders of parent and child run in parallel; the child must not
    // fetch anything just because its own route has no requirement.
    const detailsLoader = vi.fn();

    render_(
      "/notes/42",
      notesRoutes(detailsLoader, {
        type: "permission",
        permission: "users.view",
      }),
    );

    expect(
      await screen.findByText(
        "You don't have permission to access this page.",
        {},
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
    expect(detailsLoader).not.toHaveBeenCalled();
  });
  it("gives a page the content file from its config", async () => {
    render_("/about", [
      {
        path: "/about",
        layout: "application",
        page: page(() => <PageContent />),
        content: async () => ({
          default: {
            sections: [
              {
                heading: "Our story",
                blocks: [
                  { type: "paragraph", text: "It started with a list." },
                ],
              },
            ],
          },
        }),
        meta: { title: "About" },
      },
    ]);

    expect(
      await screen.findByRole("heading", { name: "Our story" }, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    expect(screen.getByText("It started with a list.")).toBeInTheDocument();
  });
});
