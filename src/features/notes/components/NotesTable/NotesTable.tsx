import { Table } from "@/shared/components/Table/Table";
import { useNotes } from "../../hooks/useNotes";
import type { TableFilters } from "@/shared/components/Table/types";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { filterNotes } from "../../helpers/filters";
import { columns } from "./columns";

export const NotesTable = () => {
  const [filters, setFilters] = useState<TableFilters>({});
  const { notes } = useNotes();

  const deferredFilters = useDeferredValue(filters);

  const filteredNotes = useMemo(
    () => filterNotes(notes, deferredFilters, columns),
    [notes, deferredFilters],
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
