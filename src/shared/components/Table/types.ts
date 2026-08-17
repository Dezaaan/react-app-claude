import type { ReactNode } from "react";

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  accessor: keyof T;
  width?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export type TableHeaderProps<T> = {
  columns: TableColumn<T>[];
};

export type TableBodyProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
};
