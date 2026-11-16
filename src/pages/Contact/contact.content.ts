import type { PageContent } from "@/shared/content/types";

export default {
  sections: [
    {
      heading: "Email",
      blocks: [
        {
          type: "paragraph",
          text: "For questions about your account or your notes, write to us and we'll reply as soon as we can.",
        },
        {
          type: "links",
          links: [
            // Placeholder address until the real one is decided.
            {
              label: "support@example.com",
              href: "mailto:support@example.com",
            },
          ],
        },
      ],
    },
    {
      heading: "When you write",
      blocks: [
        {
          type: "list",
          items: [
            "The email address you log in with.",
            "What you were doing when the problem happened.",
            "What you expected to happen instead.",
          ],
        },
      ],
    },
  ],
} satisfies PageContent;
