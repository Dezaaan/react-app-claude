import {
  useCallback,
  useContext,
  useLayoutEffect,
  type CSSProperties,
} from "react";
import { List, useListCallbackRef } from "react-window";

import { TableScrollbarContext } from "@/shared/components/Table/context";
import { HEADER_ROW_COUNT } from "@/shared/components/Table/helpers";
import type { TableBodyProps } from "@/shared/components/Table/types";
import styles from "./TableBody.module.scss";
import { ROW_HEIGHT, TableRow } from "./TableRow";

export const TableBody = <T,>({
  data,
  columns,
  firstRowIndex = 0,
}: TableBodyProps<T>) => {
  // A callback ref (state), not useRef: react-window only exposes its element
  // after its own first render, and this re-renders us when it does.
  const [list, setList] = useListCallbackRef(null);
  const setScrollbarWidth = useContext(TableScrollbarContext);

  // The scrollbar comes and goes with the number of rows and the window
  // size; measure it after each change so the header can match.
  // (With no rows there is no list, and this resets the width to 0.)
  const measureScrollbar = useCallback(() => {
    const element = list?.element;
    setScrollbarWidth(element ? element.offsetWidth - element.clientWidth : 0);
  }, [list, setScrollbarWidth]);

  useLayoutEffect(measureScrollbar, [measureScrollbar, data.length]);

  if (data.length === 0) {
    return (
      <div role="rowgroup">
        <div role="row" aria-rowindex={HEADER_ROW_COUNT + 1}>
          <div role="cell" className={styles.empty}>
            No results
          </div>
        </div>
      </div>
    );
  }

  return (
    <List
      // react-window renders a "list"; inside a table it is a group of rows.
      role="rowgroup"
      listRef={setList}
      className={styles.list}
      // Lets CSS shrink the body to its rows when they don't fill it.
      style={
        { "--rows-height": `${data.length * ROW_HEIGHT}px` } as CSSProperties
      }
      rowCount={data.length}
      rowHeight={ROW_HEIGHT}
      rowComponent={TableRow}
      rowProps={{
        data,
        columns,
        firstRowIndex,
      }}
      onResize={measureScrollbar}
      // The height comes from CSS (it follows the window); this is only
      // used until the list has measured itself.
      defaultHeight={600}
    />
  );
};
