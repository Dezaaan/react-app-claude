import type { PageContent } from "@/shared/content/types";

export default {
  sections: [
    {
      heading: "Your account",
      blocks: [
        {
          type: "paragraph",
          text: "You log in with your email address and password. Editing your profile here is coming soon.",
        },
      ],
    },
    {
      heading: "Roles",
      blocks: [
        {
          type: "paragraph",
          text: "Your role decides what you can do with notes:",
        },
        {
          type: "list",
          items: ["User: view and edit notes.", "Viewer: view notes only."],
        },
      ],
    },
  ],
} satisfies PageContent;
