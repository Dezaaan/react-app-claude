import type { TableHeaderRowProps } from "../types";
import styles from "./TableHeader.module.scss";

export const TableHeaderRow = <T,>({
  columns,
  gridTemplateColumns,
}: TableHeaderRowProps<T>) => {
  return (
    <div className={styles.headerRow} style={{ gridTemplateColumns }}>
      {columns.map((column) => (
        <div key={column.id} className={styles.cell}>
          {column.header}
        </div>
      ))}
    </div>
  );
};
