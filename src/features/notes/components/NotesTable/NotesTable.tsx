import { Table } from "@/shared/components/Table/Table";
import type { TableFilters } from "@/shared/components/Table/types";
import { useCallback, useMemo, useState } from "react";
import { filterNotes } from "../../helpers/filters";
import { columns } from "./columns";
import { useDebouncedValue } from "@/shared/hooks/useDebounceValue";
import type { NotesFeatureProps } from "../../types";

export const NotesTable = ({ notes }: NotesFeatureProps) => {
  const [filters, setFilters] = useState<TableFilters>({});

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
