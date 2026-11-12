import { memo, useCallback, useMemo, type MouseEvent } from "react";
import { List } from "react-window";

import type { Note } from "@/features/notes/types";
import { NoteRow, type ListEnd } from "./NoteRow";
import styles from "./NotesList.module.scss";

/** Ask for more when the last visible row is this close to the end. */
const LOAD_AHEAD_ROWS = 5;

type NotesListProps = {
  notes: Note[];
  /** All notes on the server, loaded or not (for "item 3 of 45"). */
  totalCount: number;
  hasMore: boolean;
  isLoading: boolean;
  /** Message when loading more failed. */
  error?: string;
  /** The user scrolled near the end and there is more to load. */
  onEndReached: () => void;
  onClickNoteItem: (note: Note) => void;
};

export const NotesList = memo(
  ({
    notes,
    totalCount,
    hasMore,
    isLoading,
    error,
    onEndReached,
    onClickNoteItem,
  }: NotesListProps) => {
    const handleNoteClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        const noteId = (event.target as HTMLElement).closest<HTMLElement>(
          "[data-note-id]",
        )?.dataset.noteId;
        const note = notes.find((note) => note.id === noteId);

        if (note) {
          onClickNoteItem(note);
        }
      },
      [notes, onClickNoteItem],
    );

    // A last row after the notes says what's going on at the end.
    const end: ListEnd = error
      ? { type: "error", message: error, onRetry: onEndReached }
      : hasMore
        ? { type: "loading" }
        : { type: "done", count: notes.length };

    const rowProps = useMemo(
      () => ({ notes, totalCount, end, handleNoteClick }),
      // `end` is rebuilt every render; its parts are the real dependencies.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [notes, totalCount, error, hasMore, onEndReached, handleNoteClick],
    );

    const handleRowsRendered = useCallback(
      ({ stopIndex }: { startIndex: number; stopIndex: number }) => {
        if (
          hasMore &&
          !isLoading &&
          !error &&
          stopIndex >= notes.length - 1 - LOAD_AHEAD_ROWS
        ) {
          onEndReached();
        }
      },
      [hasMore, isLoading, error, notes.length, onEndReached],
    );

    return (
      <List
        aria-label="Notes"
        aria-busy={isLoading}
        className={styles.list}
        rowCount={notes.length + 1}
        rowHeight={100}
        rowProps={rowProps}
        rowComponent={NoteRow}
        onRowsRendered={handleRowsRendered}
        // The height comes from CSS; this is used until the list measures itself.
        defaultHeight={700}
      />
    );
  },
);
