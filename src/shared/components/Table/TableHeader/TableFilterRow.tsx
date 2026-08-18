import type { TableFilterRowProps } from "../types";
import styles from "./TableHeader.module.scss";

export const TableFilterRow = <T,>({
  columns,
  filters,
  onFilterChange,
  gridTemplateColumns,
}: TableFilterRowProps<T>) => {
  const handleFilterChange = (columnId: string, value: string) => {
    onFilterChange?.(columnId, value);
  };

  return (
    <div className={styles.filterRow} style={{ gridTemplateColumns }}>
      {columns.map((column) => (
        <div key={column.id} className={styles.cell}>
          {column.searchable && (
            <input
              value={filters?.[column.id] ?? ""}
              onChange={(event) =>
                handleFilterChange(column.id, event.target.value)
              }
              placeholder={`Search ${String(column.header)}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
