import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { normalizeError } from "@/shared/errors/normalizeError";
import { DEFAULT_USER_MESSAGES } from "@/shared/errors/errorCodes";
import { usePendingIndicator } from "@/shared/pending/pendingContext";
import { notesQueries } from "@/features/notes/api/notesQueries";
import { NoteDetailsModal } from "@/features/notes/components/NoteDetailsModal/NoteDetailsModal";
import { NotesList } from "@/features/notes/components/NotesList/NotesList";
import type { Note } from "@/features/notes/types";
import styles from "./NotesFeature.module.scss";

/** All notes, newest first, loading more as the user scrolls. */
export const NotesFeature = () => {
  // The selected note doubles as the modal's open state.
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  // The route loader put the first page in the cache.
  const {
    data: { items, totalItems },
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    error,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(notesQueries.infinite());

  usePendingIndicator(isFetchingNextPage);

  // The list asks for more as it nears the end, possibly several times
  // before a re-render; cancelRefetch: false makes the extra calls join the
  // request already running instead of starting it over.
  const loadMore = useCallback(() => {
    void fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage]);

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
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        error={
          isFetchNextPageError
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
