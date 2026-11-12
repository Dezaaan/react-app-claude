import type { ReactNode } from "react";

export type SortOrder = "asc" | "desc";

export type TableSort = {
  columnId: string;
  order: SortOrder;
};

export type TableHeaderProps<T> = {
  columns: TableColumn<T>[];
  filters?: TableFilters;
  onFilterChange?: TableFilterChangeHandler;
  /** The current sort, shown on the header of that column. */
  sort?: TableSort;
  /** Called with the column whose header was clicked (`sortable` ones). */
  onSortChange?: (columnId: string) => void;
};

export type TableHeaderRowProps<T> = {
  columns: TableColumn<T>[];
  gridTemplateColumns: string;
  sort?: TableSort;
  onSortChange?: (columnId: string) => void;
};

export type TableBodyProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  /**
   * Position of `data[0]` among all rows, when `data` is one page of a
   * longer list (e.g. 40 on page 3 of 20), so screen readers number rows
   * across pages. Default 0.
   */
  firstRowIndex?: number;
};

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  accessor: keyof T;
  /** Shows a filter input for this column. */
  searchable?: boolean;
  /** The header becomes a button that sorts by this column. */
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  /**
   * Text the column filter matches against. Defaults to `String(value)`.
   * Set this when `render` displays something different from the raw value
   * (e.g. a formatted date), so users can search for what they see.
   */
  filterValue?: (value: T[keyof T], row: T) => string;
};

export type TableFilters = Record<string, string>;

export type TableFilterRowProps<T> = {
  columns: TableColumn<T>[];
  filters?: Record<string, string>;
  onFilterChange?: TableFilterChangeHandler;
  gridTemplateColumns: string;
};

export type TableFilterChangeHandler = (
  columnId: string,
  value: string,
) => void;
