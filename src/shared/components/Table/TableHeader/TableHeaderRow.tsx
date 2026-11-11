import type { TableHeaderRowProps } from "@/shared/components/Table/types";
import styles from "./TableHeader.module.scss";

export const TableHeaderRow = <T,>({
  columns,
  gridTemplateColumns,
}: TableHeaderRowProps<T>) => {
  return (
    <div
      role="row"
      aria-rowindex={1}
      className={styles.headerRow}
      style={{ gridTemplateColumns }}
    >
      {columns.map((column) => (
        <div key={column.id} role="columnheader" className={styles.cell}>
          {column.header}
        </div>
      ))}
    </div>
  );
};
