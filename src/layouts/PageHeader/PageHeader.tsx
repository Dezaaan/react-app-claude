import { useEffect } from "react";

import { useRouteMeta } from "@/app/router/useRouteMeta";
import type { Text } from "@/shared/content/types";
import styles from "./PageHeader.module.scss";

const APP_NAME = "Notes";

type PageHeaderProps = {
  /** Replaces the config title, for pages that know theirs only at runtime (a note's title). */
  title?: Text;
  /** Replaces the config description. */
  description?: Text;
};

/**
 * The page's heading and the sentence under it, from the route config
 * (`meta.title`, `meta.description`). Also sets the browser tab title.
 */
export const PageHeader = ({ title, description }: PageHeaderProps) => {
  const meta = useRouteMeta();
  const heading = title ?? meta?.title;
  const text = description ?? meta?.description;

  useEffect(() => {
    document.title = heading ? `${heading} · ${APP_NAME}` : APP_NAME;
  }, [heading]);

  return (
    <header className={styles.header}>
      <h1>{heading}</h1>
      {text && <p>{text}</p>}
    </header>
  );
};
