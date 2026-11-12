import { useId } from "react";

import type { Paginated } from "@/shared/api/pagination";
import { Pagination } from "@/shared/components/Pagination/Pagination";
import { Table } from "@/shared/components/Table/Table";
import { useTableUrlState } from "@/shared/components/Table/useTableUrlState";
import {
  DEFAULT_NOTE_PAGE_SIZE,
  DEFAULT_NOTE_SORT,
  NOTE_FILTER_KEYS,
  NOTE_PAGE_SIZES,
} from "@/features/notes/helpers/notesQuery";
import type { Note } from "@/features/notes/types";
import { columns } from "./columns";
import styles from "./NotesTable.module.scss";

type NotesTableProps = {
  /** The page the loader fetched for the current URL. */
  notes: Paginated<Note>;
};

const formatCount = (count: number) => count.toLocaleString("en-US");

/** "Showing 21–40 of 45 notes", "No notes match", "1 note". */
const summary = ({ items, pagination }: Paginated<Note>) => {
  const { page, pageSize, totalItems } = pagination;

  if (totalItems === 0) return "No notes found";
  if (totalItems <= pageSize && page === 1) {
    return `${formatCount(totalItems)} ${totalItems === 1 ? "note" : "notes"}`;
  }
  if (items.length === 0) return `No notes on page ${page}`;

  const first = (page - 1) * pageSize + 1;
  const last = first + items.length - 1;
  return `Showing ${formatCount(first)}–${formatCount(last)} of ${formatCount(totalItems)} notes`;
};

/** Notes one page at a time; filters, sorting and page live in the URL. */
export const NotesTable = ({ notes }: NotesTableProps) => {
  const pageSizeId = useId();
  const {
    filters,
    onFilterChange,
    sort,
    onSortChange,
    pageSize,
    setPageSize,
    hrefForPage,
  } = useTableUrlState({
    filterKeys: NOTE_FILTER_KEYS,
    defaultSort: DEFAULT_NOTE_SORT,
    defaultPageSize: DEFAULT_NOTE_PAGE_SIZE,
  });

  const { items, pagination } = notes;

  return (
    <div className={styles.notesTable}>
      <div className={styles.toolbar}>
        <input
          type="search"
          aria-label="Search notes"
          placeholder="Search title or content"
          className={styles.search}
          value={filters.search ?? ""}
          onChange={(event) => onFilterChange("search", event.target.value)}
        />

        {/* Announced when the results change. */}
        <p role="status" className={styles.status}>
          {summary(notes)}
        </p>
      </div>

      <Table aria-label="Notes" minWidth={640} rowCount={pagination.totalItems}>
        <Table.Header
          columns={columns}
          filters={filters}
          onFilterChange={onFilterChange}
          sort={sort}
          onSortChange={onSortChange}
        />
        <Table.Body
          data={items}
          columns={columns}
          firstRowIndex={(pagination.page - 1) * pagination.pageSize}
        />
      </Table>

      <div className={styles.footer}>
        <label htmlFor={pageSizeId} className={styles.pageSize}>
          Rows per page
          <select
            id={pageSizeId}
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            {NOTE_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <Pagination
          label="Notes pages"
          page={pagination.page}
          totalPages={pagination.totalPages}
          hrefForPage={hrefForPage}
        />
      </div>
    </div>
  );
};
