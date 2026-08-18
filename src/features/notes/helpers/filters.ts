import type {
  TableFilters,
  TableColumn,
} from "@/shared/components/Table/types";
import type { Note } from "../types";

export const filterNotes = (
  notes: Note[],
  filters: TableFilters,
  columns: TableColumn<Note>[],
) => {
  return notes.filter((note) =>
    columns.every((column) => {
      const filter = filters[column.id];

      if (!filter) {
        return true;
      }

      const value = note[column.accessor];

      return String(value).toLowerCase().includes(filter.toLowerCase());
    }),
  );
};
