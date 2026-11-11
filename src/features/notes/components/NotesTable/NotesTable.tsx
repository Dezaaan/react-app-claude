import { Table } from "@/shared/components/Table/Table";
import { useTableFilters } from "@/shared/components/Table/useTableFilters";
import type { NotesFeatureProps } from "../../types";
import { columns } from "./columns";

const formatCount = (count: number) => count.toLocaleString("en-US");

export const NotesTable = ({ notes }: NotesFeatureProps) => {
  const {
    filters,
    onFilterChange,
    rows: filteredNotes,
  } = useTableFilters(notes, columns);

  return (
    <>
      {/* Announced after filtering, so screen reader users hear the result. */}
      <p role="status">
        {filteredNotes.length === notes.length
          ? `${formatCount(notes.length)} notes`
          : `Showing ${formatCount(filteredNotes.length)} of ${formatCount(notes.length)} notes`}
      </p>

      <Table aria-label="Notes" rowCount={filteredNotes.length}>
        <Table.Header
          columns={columns}
          filters={filters}
          onFilterChange={onFilterChange}
        />
        <Table.Body data={filteredNotes} columns={columns} />
      </Table>
    </>
  );
};
