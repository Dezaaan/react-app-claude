import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/shared/utils/cn";
import { HEADER_ROW_COUNT } from "./helpers";
import { TableBody } from "./TableBody/TableBody";
import { TableHeader } from "./TableHeader/TableHeader";
import styles from "./Table.module.scss";

type TableProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  /**
   * Number of data rows. The body is virtualized, so only the visible rows
   * exist in the page; this tells screen readers how many there are in total.
   */
  rowCount?: number;
};

/**
 * Built from divs (so the body can be virtualized), with ARIA table roles
 * so screen readers still read it as a table. Name it with `aria-label`
 * or `aria-labelledby`.
 */
export const Table = ({
  children,
  className,
  rowCount,
  ...props
}: TableProps) => {
  return (
    <div className={styles.scroll}>
      <div
        role="table"
        aria-rowcount={
          rowCount === undefined ? undefined : rowCount + HEADER_ROW_COUNT
        }
        {...props}
        className={cn(styles.table, className)}
      >
        {children}
      </div>
    </div>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
