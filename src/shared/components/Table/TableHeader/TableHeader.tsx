import { getGridTemplateColumns } from "../helpers";
import type { TableHeaderProps } from "../types";
import styles from "./TableHeader.module.scss";
import tableStyles from "../Table.module.scss";

export const TableHeader = <T,>({ columns }: TableHeaderProps<T>) => {
  const gridTemplateColumns = getGridTemplateColumns(columns);

  return (
    <div className={styles.header} style={{ gridTemplateColumns }}>
      {columns.map((column) => (
        <div key={column.id} className={tableStyles.cell}>
          {column.header}
        </div>
      ))}
    </div>
  );
};
