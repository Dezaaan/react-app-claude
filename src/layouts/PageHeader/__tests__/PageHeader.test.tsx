import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { buildRoutes } from "@/app/router/buildRoutes";
import type { RouteConfig } from "@/app/router/types";
import { PageHeader } from "@/layouts/PageHeader/PageHeader";
import { LOAD_TIMEOUT } from "@/test/utils";

const page = (component: () => React.ReactNode) => async () => ({
  default: component,
});

// Built like the app's routes, so the meta reaches the page the same way.
const renderAt = (path: string, routes: RouteConfig[]) =>
  render(
    <RouterProvider
      router={createMemoryRouter(buildRoutes(routes, { guarded: false }), {
        initialEntries: [path],
      })}
    />,
  );

const aboutRoute: RouteConfig = {
  path: "/about",
  layout: "standalone",
  page: page(() => <PageHeader />),
  meta: { title: "About", description: "Learn more about us." },
};

describe("PageHeader", () => {
  it("shows the route's title and description from the config", async () => {
    renderAt("/about", [aboutRoute]);

    expect(
      await screen.findByRole(
        "heading",
        { name: "About", level: 1 },
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Learn more about us.")).toBeInTheDocument();
  });

  it("sets the browser tab title", async () => {
    renderAt("/about", [aboutRoute]);

    await waitFor(() => expect(document.title).toBe("About · Notes"));
  });

  it("uses the deepest matched route's meta", async () => {
    renderAt("/notes/42", [
      {
        path: "/notes",
        layout: "standalone",
        meta: { title: "Notes", description: "All your notes." },
        children: [
          {
            path: ":id",
            page: page(() => <PageHeader />),
            meta: { title: "Note" },
          },
        ],
      },
    ]);

    expect(
      await screen.findByRole("heading", { name: "Note" }, LOAD_TIMEOUT),
    ).toBeInTheDocument();
    // The parent's description doesn't leak into the child.
    expect(screen.queryByText("All your notes.")).not.toBeInTheDocument();
  });

  it("lets the page pass a title known only at runtime", async () => {
    renderAt("/about", [
      {
        ...aboutRoute,
        page: page(() => <PageHeader title="Shopping list" />),
      },
    ]);

    expect(
      await screen.findByRole(
        "heading",
        { name: "Shopping list" },
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe("Shopping list · Notes"));
    // The config's description still shows.
    expect(screen.getByText("Learn more about us.")).toBeInTheDocument();
  });
});
