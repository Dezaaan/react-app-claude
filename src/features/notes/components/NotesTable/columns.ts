import type { TableColumn } from "@/shared/components/Table/types";
import { formatDate } from "@/shared/utils/formatDate";
import type { Note } from "@/features/notes/types";

// Filters and sorting run on the server, so only what the API supports is
// searchable (title) or sortable (title, createdAt, updatedAt).
export const columns: TableColumn<Note>[] = [
  {
    id: "title",
    header: "Title",
    accessor: "title",
    width: "minmax(140px, 2fr)",
    searchable: true,
    sortable: true,
  },
  {
    id: "content",
    header: "Content",
    accessor: "content",
    width: "minmax(180px, 4fr)",
  },
  {
    id: "createdAt",
    header: "Created",
    accessor: "createdAt",
    width: "minmax(120px, 1.25fr)",
    sortable: true,
    render: (value) => formatDate(String(value)),
  },
  {
    id: "updatedAt",
    header: "Updated",
    accessor: "updatedAt",
    width: "minmax(120px, 1.25fr)",
    sortable: true,
    render: (value) => formatDate(String(value)),
  },
];
