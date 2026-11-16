/**
 * Text shown to users. A plain string for now. If the app gets
 * translations, this becomes a translation key and the components that
 * render it (PageHeader, and later page content) look the key up, so no
 * page or config needs a different shape.
 */
export type Text = string;

/** A link: an app path ("/contact") or an outside address ("mailto:…", "https://…"). */
export type ContentLink = { label: Text; href: string };

/**
 * One piece of page content. Formatting is data, not HTML strings, so the
 * text never needs dangerouslySetInnerHTML and every string stays a Text.
 */
export type ContentBlock =
  | { type: "paragraph"; text: Text }
  | { type: "list"; items: Text[] }
  | { type: "links"; links: ContentLink[] };

export type ContentSection = {
  heading: Text;
  blocks: ContentBlock[];
};

/** A page's longer content, in its own `*.content.ts` file. */
export type PageContent = {
  sections: ContentSection[];
};

/** A content file: its default export is the content. */
export type ContentModule = { default: PageContent };
