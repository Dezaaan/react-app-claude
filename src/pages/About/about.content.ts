import { ROUTES } from "@/app/router/routes";
import type { PageContent } from "@/shared/content/types";

export default {
  sections: [
    {
      heading: "What Notes is",
      blocks: [
        {
          type: "paragraph",
          text: "Notes is a simple place to keep your notes: short lists, reminders and ideas you want to find again later.",
        },
      ],
    },
    {
      heading: "What you can do",
      blocks: [
        {
          type: "list",
          items: [
            "Browse your latest notes on the home page.",
            "Search, sort and page through all your notes in a table.",
            "Open a note to read it in full.",
          ],
        },
      ],
    },
    {
      heading: "Questions",
      blocks: [
        {
          type: "paragraph",
          text: "Missing something, or found a problem? Let us know.",
        },
        {
          type: "links",
          links: [{ label: "Contact us", href: ROUTES.CONTACT }],
        },
      ],
    },
  ],
} satisfies PageContent;
