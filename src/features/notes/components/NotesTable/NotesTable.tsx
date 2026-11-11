import { Table } from "@/shared/components/Table/Table";
import { useTableFilters } from "@/shared/components/Table/useTableFilters";
import type { NotesFeatureProps } from "@/features/notes/types";
import { columns } from "./columns";
import styles from "./NotesTable.module.scss";

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
      <p role="status" className={styles.status}>
        {filteredNotes.length === notes.length
          ? `${formatCount(notes.length)} notes`
          : `Showing ${formatCount(filteredNotes.length)} of ${formatCount(notes.length)} notes`}
      </p>

      <Table aria-label="Notes" minWidth={640} rowCount={filteredNotes.length}>
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
