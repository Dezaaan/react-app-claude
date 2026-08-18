import { Table } from "@/shared/components/Table/Table";
import { useNotes } from "../../hooks/useNotes";
import type { TableFilters } from "@/shared/components/Table/types";
import { useCallback, useMemo, useState } from "react";
import { filterNotes } from "../../helpers/filters";
import { columns } from "./columns";
import { useDebouncedValue } from "@/shared/hooks/useDebounceValue";

export const NotesTable = () => {
  const [filters, setFilters] = useState<TableFilters>({});
  const { notes } = useNotes();

  const debouncedFilters = useDebouncedValue(filters, 200);

  const filteredNotes = useMemo(
    () => filterNotes(notes, debouncedFilters, columns),
    [notes, debouncedFilters],
  );

  const handleFilterChange = useCallback((columnId: string, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [columnId]: value,
    }));
  }, []);

  return (
    <Table>
      <Table.Header
        columns={columns}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <Table.Body data={filteredNotes} columns={columns} />
    </Table>
  );
};
