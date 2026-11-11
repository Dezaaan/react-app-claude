import { getColumnLabel } from "../helpers";
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
    <div
      role="row"
      aria-rowindex={2}
      className={styles.filterRow}
      style={{ gridTemplateColumns }}
    >
      {columns.map((column) => {
        const label = getColumnLabel(column);

        return (
          <div key={column.id} role="cell" className={styles.cell}>
            {column.searchable && (
              <input
                type="search"
                // A placeholder disappears while typing and isn't a label.
                aria-label={`Filter by ${label}`}
                value={filters?.[column.id] ?? ""}
                onChange={(event) =>
                  handleFilterChange(column.id, event.target.value)
                }
                placeholder={`Search ${label}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
