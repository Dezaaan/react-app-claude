import type { Note } from "@/features/notes/types";
import type { TableColumn } from "@/shared/components/Table/types";
import { formatDate } from "@/shared/utils/formatDate";

export const columns: TableColumn<Note>[] = [
  {
    id: "id",
    header: "ID",
    accessor: "id",
    width: "minmax(140px, 3fr)",
    searchable: true,
  },
  {
    id: "title",
    header: "Title",
    accessor: "title",
    width: "minmax(100px, 1.5fr)",
    searchable: true,
  },
  {
    id: "content",
    header: "Content",
    accessor: "content",
    width: "minmax(160px, 3fr)",
    searchable: true,
  },
  {
    id: "createdAt",
    header: "Created At",
    accessor: "createdAt",
    width: "minmax(130px, 1.5fr)",
    searchable: true,
    render: (value) => formatDate(String(value)),
    filterValue: (value) => formatDate(String(value)),
  },
];
