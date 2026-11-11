import type { RowComponentProps } from "react-window";

import styles from "./TableBody.module.scss";
import tableStyles from "../Table.module.scss";

import type { TableColumn } from "../types";
import { getGridTemplateColumns, HEADER_ROW_COUNT } from "../helpers";

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

  // react-window's ariaAttributes are for a list; a table row needs its
  // position in the whole table instead, header rows included.
  return (
    <div
      role="row"
      aria-rowindex={index + HEADER_ROW_COUNT + 1}
      style={style}
      className={styles.row}
    >
      <div className={styles.rowContent} style={{ gridTemplateColumns }}>
        {columns.map((column) => {
          const value = row[column.accessor];

          return (
            <div key={column.id} role="cell" className={tableStyles.cell}>
              {column.render ? column.render(value, row) : String(value)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
