// footerData.ts

import type { FooterColumn } from "./types";

export const footerConfig: FooterColumn[] = [
  {
    id: "about",
    title: "About",
    items: [
      {
        id: "about-notes",
        label: "About Notes",
      },
      {
        id: "our-mission",
        label: "Our Mission",
      },
      {
        id: "privacy-policy",
        label: "Privacy Policy",
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    items: [
      {
        id: "documentation",
        label: "Documentation",
      },
      {
        id: "api",
        label: "API",
      },
      {
        id: "faq",
        label: "FAQ",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    items: [
      {
        id: "email",
        label: "Email",
      },
      {
        id: "support",
        label: "Support",
      },
      {
        id: "github",
        label: "GitHub",
      },
    ],
  },
];
