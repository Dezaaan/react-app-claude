import { getGridTemplateColumns } from "../helpers";
import type { TableHeaderProps } from "../types";
import { TableFilterRow } from "./TableFilterRow";
import styles from "./TableHeader.module.scss";
import { TableHeaderRow } from "./TableHeaderRow";

export const TableHeader = <T,>({
  columns,
  filters,
  onFilterChange,
}: TableHeaderProps<T>) => {
  const gridTemplateColumns = getGridTemplateColumns(columns);

  return (
    <div role="rowgroup" className={styles.header}>
      <TableHeaderRow
        columns={columns}
        gridTemplateColumns={gridTemplateColumns}
      />

      <TableFilterRow
        columns={columns}
        filters={filters}
        onFilterChange={onFilterChange}
        gridTemplateColumns={gridTemplateColumns}
      />
    </div>
  );
};
