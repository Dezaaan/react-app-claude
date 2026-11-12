import { useCallback, useState } from "react";

import type { Paginated } from "@/shared/api/pagination";
import { normalizeError } from "@/shared/errors/normalizeError";
import { DEFAULT_USER_MESSAGES } from "@/shared/errors/errorCodes";
import {
  useInfiniteList,
  type FetchPage,
} from "@/shared/hooks/useInfiniteList";
import { notesApi } from "@/features/notes/api/notesApi";
import { NoteDetailsModal } from "@/features/notes/components/NoteDetailsModal/NoteDetailsModal";
import { NotesList } from "@/features/notes/components/NotesList/NotesList";
import { HOME_NOTES_PAGE_SIZE } from "@/features/notes/loaders/notesLoader";
import type { Note } from "@/features/notes/types";
import styles from "./NotesFeature.module.scss";

type NotesFeatureProps = {
  /** The first page, from the route loader. */
  notes: Paginated<Note>;
};

// Same query as the loader, one page further each time.
const fetchNotesPage: FetchPage<Note> = (page, signal) =>
  notesApi.getNotes({ page, pageSize: HOME_NOTES_PAGE_SIZE }, { signal });

/** All notes, newest first, loading more as the user scrolls. */
export const NotesFeature = ({ notes }: NotesFeatureProps) => {
  // The selected note doubles as the modal's open state.
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { items, totalItems, hasMore, isLoading, error, loadMore } =
    useInfiniteList(notes, fetchNotesPage);

  const handleClose = useCallback(() => {
    setSelectedNote(null);
  }, []);

  if (totalItems === 0) {
    return <p className={styles.empty}>No notes yet.</p>;
  }

  return (
    <>
      <p className={styles.count}>
        {items.length} of {totalItems} notes loaded
      </p>

      <NotesList
        notes={items}
        totalCount={totalItems}
        hasMore={hasMore}
        isLoading={isLoading}
        error={
          error
            ? (normalizeError(error).userMessage ??
              DEFAULT_USER_MESSAGES.UNKNOWN_ERROR)
            : undefined
        }
        onEndReached={loadMore}
        onClickNoteItem={setSelectedNote}
      />
      <NoteDetailsModal note={selectedNote} onClose={handleClose} />
    </>
  );
};
