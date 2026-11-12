export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteSortField = "createdAt" | "updatedAt" | "title";

export type SortOrder = "asc" | "desc";

/** GET /notes query. Every field is optional; the backend has defaults. */
export type NotesQuery = {
  /** 1-based, default 1. */
  page?: number;
  /** Default 20, at most MAX_PAGE_SIZE (100). */
  pageSize?: number;
  /** Matches title or content, case-insensitive. */
  search?: string;
  /** Matches the title, case-insensitive. */
  title?: string;
  /** Default "createdAt". */
  sortBy?: NoteSortField;
  /** Default "desc". */
  sortOrder?: SortOrder;
};

export type NotesFeatureProps = {
  notes: Note[];
};
