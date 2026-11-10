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
  // Resolve active filters once instead of once per note.
  const activeFilters = columns.flatMap((column) => {
    const query = filters[column.id]?.trim().toLowerCase();
    return query ? [{ column, query }] : [];
  });

  if (activeFilters.length === 0) {
    return notes;
  }

  return notes.filter((note) =>
    activeFilters.every(({ column, query }) => {
      const value = note[column.accessor];
      const text = column.filterValue
        ? column.filterValue(value, note)
        : String(value);

      return text.toLowerCase().includes(query);
    }),
  );
};
