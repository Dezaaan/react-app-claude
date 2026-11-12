import type {
  TableColumn,
  TableHeaderRowProps,
  TableSort,
} from "@/shared/components/Table/types";
import styles from "./TableHeader.module.scss";

const ariaSort = <T,>(column: TableColumn<T>, sort?: TableSort) => {
  if (!column.sortable) return undefined;
  if (sort?.columnId !== column.id) return "none";
  return sort.order === "asc" ? "ascending" : "descending";
};

const SORT_ICONS = { ascending: "▲", descending: "▼", none: "↕" } as const;

export const TableHeaderRow = <T,>({
  columns,
  gridTemplateColumns,
  sort,
  onSortChange,
}: TableHeaderRowProps<T>) => {
  return (
    <div
      role="row"
      aria-rowindex={1}
      className={styles.headerRow}
      style={{ gridTemplateColumns }}
    >
      {columns.map((column) => {
        const sorted = ariaSort(column, sort);

        return (
          <div
            key={column.id}
            role="columnheader"
            // Screen readers announce "sorted ascending" from this.
            aria-sort={sorted}
            className={styles.cell}
          >
            {sorted && onSortChange ? (
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => onSortChange(column.id)}
              >
                {column.header}
                <span
                  aria-hidden="true"
                  className={sorted === "none" ? styles.sortIdle : undefined}
                >
                  {SORT_ICONS[sorted]}
                </span>
              </button>
            ) : (
              column.header
            )}
          </div>
        );
      })}
    </div>
  );
};
