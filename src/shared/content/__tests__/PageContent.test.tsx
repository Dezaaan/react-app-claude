import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PageContent } from "@/shared/content/PageContent";
import type { PageContent as Content } from "@/shared/content/types";

const content: Content = {
  sections: [
    {
      heading: "Story",
      blocks: [{ type: "paragraph", text: "We like notes." }],
    },
    {
      heading: "Features",
      blocks: [
        { type: "list", items: ["Search", "Sort"] },
        {
          type: "links",
          links: [
            { label: "Contact us", href: "/contact" },
            { label: "Email", href: "mailto:support@example.com" },
          ],
        },
      ],
    },
  ],
};

const renderContent = () =>
  render(
    <MemoryRouter>
      <PageContent content={content} />
    </MemoryRouter>,
  );

describe("PageContent", () => {
  it("shows each section with its heading and text", () => {
    renderContent();

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["Story", "Features"]);
    expect(screen.getByText("We like notes.")).toBeInTheDocument();
  });

  it("shows lists as list items", () => {
    renderContent();

    const features = screen.getByRole("region", { name: "Features" });
    const [list] = within(features).getAllByRole("list");
    expect(
      within(list)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Search", "Sort"]);
  });

  it("links to app paths and outside addresses", () => {
    renderContent();

    expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:support@example.com",
    );
  });
});
