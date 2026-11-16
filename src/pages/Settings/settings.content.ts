import type { PageContent } from "@/shared/content/types";

export default {
  sections: [
    {
      heading: "Appearance",
      blocks: [
        {
          type: "paragraph",
          text: "Notes follows your device's light or dark mode. Change it in your system settings.",
        },
      ],
    },
    {
      heading: "Session",
      blocks: [
        {
          type: "paragraph",
          text: "You stay logged in on this browser until you log out from the user menu.",
        },
      ],
    },
  ],
} satisfies PageContent;
