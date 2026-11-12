import type { RowComponentProps } from "react-window";

import {
  getGridTemplateColumns,
  HEADER_ROW_COUNT,
} from "@/shared/components/Table/helpers";
import tableStyles from "@/shared/components/Table/Table.module.scss";
import type { TableColumn } from "@/shared/components/Table/types";
import styles from "./TableBody.module.scss";

export const ROW_HEIGHT = 48;

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
      style={{ ...style, gridTemplateColumns }}
      className={styles.row}
    >
      {columns.map((column) => {
        const value = row[column.accessor];

        return (
          <div key={column.id} role="cell" className={tableStyles.cell}>
            {/* The span truncates long values with "…". */}
            <span className={tableStyles.text}>
              {column.render ? column.render(value, row) : String(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
