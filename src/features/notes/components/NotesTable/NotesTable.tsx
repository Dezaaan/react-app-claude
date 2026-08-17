import { Table } from "@/shared/components/Table/Table";
import { useNotes } from "../../hooks/useNotes";
import type { Note } from "../../types";
import type { TableColumn } from "@/shared/components/Table/types";
import { useMemo } from "react";

export const NotesTable = () => {
  const { notes } = useNotes();

  const columns = useMemo<TableColumn<Note>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessor: "id",
        width: "330px",
      },
      {
        id: "title",
        header: "Title",
        accessor: "title",
        width: "150px",
      },
      {
        id: "content",
        header: "Content",
        accessor: "content",
        width: "300px",
      },
      {
        id: "createdAt",
        header: "Created At",
        accessor: "createdAt",
        width: "2fr",
      },
    ],
    [],
  );

  return (
    <Table>
      <Table.Header columns={columns} />
      <Table.Body data={notes} columns={columns} />
    </Table>
  );
};
