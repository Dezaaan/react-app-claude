import styles from "./TableBody.module.scss";
import type { TableBodyProps } from "../types";
import { List } from "react-window";
import { TableRow } from "./TableRow";

export const TableBody = <T,>({ data, columns }: TableBodyProps<T>) => {
  return (
    <List
      className={styles.list}
      rowCount={data.length}
      rowHeight={60}
      rowComponent={TableRow}
      rowProps={{
        data,
        columns,
      }}
      style={{
        width: "100%",
        height: "600px",
      }}
    />
  );
};
