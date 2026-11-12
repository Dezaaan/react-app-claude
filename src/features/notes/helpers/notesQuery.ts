import { TABLE_PARAMS } from "@/shared/components/Table/useTableUrlState";
import type {
  NoteSortField,
  NotesQuery,
  SortOrder,
} from "@/features/notes/types";

export const NOTE_PAGE_SIZES = [20, 50, 100] as const;
export const DEFAULT_NOTE_PAGE_SIZE = 20;

/** Matches the backend's default: newest first. */
export const DEFAULT_NOTE_SORT = {
  columnId: "createdAt",
  order: "desc",
} as const satisfies { columnId: NoteSortField; order: SortOrder };

/** URL parameters edited by the filter inputs; also sent to the API. */
export const NOTE_FILTER_KEYS = ["search", "title"] as const;

const SORT_FIELDS: readonly string[] = ["createdAt", "updatedAt", "title"];

const text = (value: string | null) => {
  const trimmed = value?.trim().slice(0, 200);
  return trimmed || undefined;
};

/**
 * The notes page URL as an API query. Anything invalid (a hand-edited URL)
 * falls back to the default instead of making the backend answer 400.
 */
export const notesQueryFromUrl = (params: URLSearchParams): NotesQuery => {
  const page = Number(params.get(TABLE_PARAMS.page));
  const pageSize = Number(params.get(TABLE_PARAMS.pageSize));
  const sortBy = params.get(TABLE_PARAMS.sortBy) ?? "";
  const sortOrder = params.get(TABLE_PARAMS.sortOrder);

  return {
    page: Number.isInteger(page) && page > 1 ? page : 1,
    pageSize: (NOTE_PAGE_SIZES as readonly number[]).includes(pageSize)
      ? pageSize
      : DEFAULT_NOTE_PAGE_SIZE,
    search: text(params.get("search")),
    title: text(params.get("title")),
    sortBy: SORT_FIELDS.includes(sortBy)
      ? (sortBy as NoteSortField)
      : DEFAULT_NOTE_SORT.columnId,
    sortOrder:
      sortOrder === "asc" || sortOrder === "desc"
        ? sortOrder
        : DEFAULT_NOTE_SORT.order,
  };
};
