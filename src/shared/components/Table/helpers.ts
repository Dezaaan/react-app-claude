import type { TableColumn } from "./types";

export const getGridTemplateColumns = <T>(columns: TableColumn<T>[]) => {
  return columns.map((column) => column.width ?? "1fr").join(" ");
};
