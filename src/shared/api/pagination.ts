/** One page of a list, as the backend returns it. */
export type Paginated<T> = {
  items: T[];
  pagination: {
    /** 1-based. */
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

/** The backend's largest allowed `pageSize`. */
export const MAX_PAGE_SIZE = 100;
