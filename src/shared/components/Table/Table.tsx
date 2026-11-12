import {
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/shared/utils/cn";
import { TableScrollbarContext } from "./context";
import { HEADER_ROW_COUNT } from "./helpers";
import { TableBody } from "@/shared/components/Table/TableBody/TableBody";
import { TableHeader } from "@/shared/components/Table/TableHeader/TableHeader";
import styles from "./Table.module.scss";

type TableProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  /**
   * Narrowest the table may get. Below this it scrolls sideways instead of
   * squeezing the columns further. By default it always fits its container.
   */
  minWidth?: CSSProperties["minWidth"];
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
  minWidth,
  rowCount,
  style,
  ...props
}: TableProps) => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  return (
    <div className={styles.scroll}>
      <div
        role="table"
        aria-rowcount={
          rowCount === undefined ? undefined : rowCount + HEADER_ROW_COUNT
        }
        {...props}
        className={cn(styles.table, className)}
        style={
          {
            ...style,
            minWidth,
            "--table-scrollbar-width": `${scrollbarWidth}px`,
          } as CSSProperties
        }
      >
        <TableScrollbarContext.Provider value={setScrollbarWidth}>
          {children}
        </TableScrollbarContext.Provider>
      </div>
    </div>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
