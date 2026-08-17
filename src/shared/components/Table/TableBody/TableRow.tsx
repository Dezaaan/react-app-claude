import type { RowComponentProps } from "react-window";

import styles from "./TableBody.module.scss";
import tableStyles from "../Table.module.scss";

import type { TableColumn } from "../types";
import { getGridTemplateColumns } from "../helpers";

type TableRowData<T> = {
  data: T[];
  columns: TableColumn<T>[];
};

export const TableRow = <T,>({
  index,
  style,
  data,
  columns,
}: RowComponentProps<TableRowData<T>>) => {
  const row = data[index];

  const gridTemplateColumns = getGridTemplateColumns(columns);

  return (
    <div style={style} className={styles.row}>
      <div className={styles.rowContent} style={{ gridTemplateColumns }}>
        {columns.map((column) => {
          const value = row[column.accessor];

          return (
            <div key={column.id} className={tableStyles.cell}>
              {column.render ? column.render(value, row) : String(value)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
