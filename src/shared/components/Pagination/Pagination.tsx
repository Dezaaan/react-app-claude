import { Link } from "react-router-dom";

import { cn } from "@/shared/utils/cn";
import { getPageItems } from "./getPageItems";
import styles from "./Pagination.module.scss";

type PaginationProps = {
  /** 1-based. */
  page: number;
  totalPages: number;
  /** URL of a page, e.g. `?page=3`. Links work with the back button. */
  hrefForPage: (page: number) => string;
  /** Names the navigation landmark, e.g. "Notes pages". */
  label?: string;
};

/** Page links: Previous, 1 … 4 5 [6] 7 8 … 20, Next. */
export const Pagination = ({
  page,
  totalPages,
  hrefForPage,
  label = "Pagination",
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav aria-label={label} className={styles.pagination}>
      {hasPrevious ? (
        <Link to={hrefForPage(page - 1)} className={styles.step}>
          Previous
        </Link>
      ) : (
        // Keep the layout steady; a disabled link isn't a thing in HTML.
        <span className={cn(styles.step, styles.disabled)} aria-hidden="true">
          Previous
        </span>
      )}

      <ol className={styles.pages}>
        {getPageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                to={hrefForPage(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(styles.page, item === page && styles.current)}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>

      {hasNext ? (
        <Link to={hrefForPage(page + 1)} className={styles.step}>
          Next
        </Link>
      ) : (
        <span className={cn(styles.step, styles.disabled)} aria-hidden="true">
          Next
        </span>
      )}
    </nav>
  );
};
