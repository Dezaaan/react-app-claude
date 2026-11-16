import { useId } from "react";
import { Link } from "react-router-dom";

import type {
  ContentBlock,
  ContentLink,
  ContentSection,
  PageContent as Content,
} from "./types";
import { usePageContent } from "./pageContentContext";
import styles from "./PageContent.module.scss";

const isAppPath = (href: string) => href.startsWith("/");

const ContentLinkItem = ({ label, href }: ContentLink) =>
  isAppPath(href) ? <Link to={href}>{label}</Link> : <a href={href}>{label}</a>;

const Block = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "links":
      return (
        <ul className={styles.links}>
          {block.links.map((link) => (
            <li key={link.href}>
              <ContentLinkItem {...link} />
            </li>
          ))}
        </ul>
      );
  }
};

/** A section is labelled by its heading, so screen readers can jump to it. */
const Section = ({ heading, blocks }: ContentSection) => {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId}>{heading}</h2>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </section>
  );
};

type PageContentProps = {
  /** Defaults to the route's content from the config. */
  content?: Content;
};

/** Renders a page's content: one section (h2 + blocks) after another. */
export const PageContent = ({ content }: PageContentProps) => {
  const routeContent = usePageContent();
  const { sections = [] } = content ?? routeContent ?? {};

  return (
    <div className={styles.content}>
      {sections.map((section) => (
        <Section key={section.heading} {...section} />
      ))}
    </div>
  );
};
