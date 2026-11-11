import type { TableColumn } from "./types";

/** The column titles row and the filter row. */
export const HEADER_ROW_COUNT = 2;

export const getGridTemplateColumns = <T>(columns: TableColumn<T>[]) => {
  return columns.map((column) => column.width ?? "1fr").join(" ");
};

/** Plain-text name of a column, for labels and placeholders. */
export const getColumnLabel = <T>(column: TableColumn<T>) =>
  typeof column.header === "string" ? column.header : column.id;
