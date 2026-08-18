import type { Note } from "../../types";
import type { TableColumn } from "@/shared/components/Table/types";
import { formatDate } from "@/shared/utils/formatDate";

export const columns: TableColumn<Note>[] = [
  {
    id: "id",
    header: "ID",
    accessor: "id",
    width: "350px",
    searchable: true,
  },
  {
    id: "title",
    header: "Title",
    accessor: "title",
    width: "150px",
    searchable: true,
  },
  {
    id: "content",
    header: "Content",
    accessor: "content",
    width: "350px",
    searchable: true,
  },
  {
    id: "createdAt",
    header: "Created At",
    accessor: "createdAt",
    width: "1fr",
    searchable: true,
    render: (value) => formatDate(String(value)),
  },
];
