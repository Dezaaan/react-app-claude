import type { Paginated } from "@/shared/api/pagination";
import { MAX_PAGE_SIZE } from "@/shared/api/pagination";
import type { Note, NoteSortField } from "@/features/notes/types";

/**
 * GET /notes as the backend implements it (notes.schema.ts and the
 * Postgres repository): validated query, case-insensitive "contains"
 * search, sorting, then one page.
 */

const SORT_FIELDS: NoteSortField[] = ["createdAt", "updatedAt", "title"];

type FieldErrors = Record<string, string[]>;

export type NotesQueryResult =
  { ok: true; page: Paginated<Note> } | { ok: false; fieldErrors: FieldErrors };

const positiveInt = (
  value: string | null,
  fallback: number,
  name: string,
  errors: FieldErrors,
  max?: number,
) => {
  if (value === null) return fallback;

  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    errors[name] = ["Too small: expected number to be >0"];
  } else if (max !== undefined && number > max) {
    errors[name] = [`Too big: expected number to be <=${max}`];
  }
  return number;
};

const text = (value: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed.toLowerCase() : undefined;
};

export const queryNotes = (
  notes: Note[],
  params: URLSearchParams,
): NotesQueryResult => {
  const errors: FieldErrors = {};
  const page = positiveInt(params.get("page"), 1, "page", errors);
  const pageSize = positiveInt(
    params.get("pageSize"),
    20,
    "pageSize",
    errors,
    MAX_PAGE_SIZE,
  );
  const sortBy = (params.get("sortBy") ?? "createdAt") as NoteSortField;
  const sortOrder = params.get("sortOrder") ?? "desc";

  if (!SORT_FIELDS.includes(sortBy)) {
    errors.sortBy = ["Invalid option"];
  }
  if (sortOrder !== "asc" && sortOrder !== "desc") {
    errors.sortOrder = ["Invalid option"];
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false, fieldErrors: errors };
  }

  const search = text(params.get("search"));
  const title = text(params.get("title"));

  const matching = notes.filter(
    (note) =>
      (!search ||
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search)) &&
      (!title || note.title.toLowerCase().includes(title)),
  );

  const direction = sortOrder === "asc" ? 1 : -1;
  const sorted = matching.toSorted(
    (a, b) =>
      direction *
      (sortBy === "title"
        ? a.title.localeCompare(b.title)
        : a[sortBy].localeCompare(b[sortBy])),
  );

  const start = (page - 1) * pageSize;

  return {
    ok: true,
    page: {
      items: sorted.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        totalItems: sorted.length,
        totalPages: Math.ceil(sorted.length / pageSize),
      },
    },
  };
};
