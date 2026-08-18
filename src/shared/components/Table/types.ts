import type { ReactNode } from "react";

export type TableHeaderProps<T> = {
  columns: TableColumn<T>[];
  filters?: TableFilters;
  onFilterChange?: TableFilterChangeHandler;
};

export type TableHeaderRowProps<T> = {
  columns: TableColumn<T>[];
  gridTemplateColumns: string;
};

export type TableBodyProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
};

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  accessor: keyof T;
  searchable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
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
