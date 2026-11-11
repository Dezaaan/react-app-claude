import { List } from "react-window";

import type { TableBodyProps } from "../types";
import styles from "./TableBody.module.scss";
import { TableRow } from "./TableRow";

export const TableBody = <T,>({ data, columns }: TableBodyProps<T>) => {
  return (
    <List
      // react-window renders a "list"; inside a table it is a group of rows.
      role="rowgroup"
      className={styles.list}
      rowCount={data.length}
      rowHeight={60}
      rowComponent={TableRow}
      rowProps={{
        data,
        columns,
      }}
      // The height comes from CSS (it follows the window); this is only
      // used until the list has measured itself.
      defaultHeight={600}
    />
  );
};
