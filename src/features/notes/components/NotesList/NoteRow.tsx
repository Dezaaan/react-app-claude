import type { MouseEventHandler } from "react";
import type { RowComponentProps } from "react-window";

import { NoteItem } from "@/features/notes/components/NoteItem/NoteItem";
import type { Note } from "@/features/notes/types";
import styles from "./NotesList.module.scss";

/** What the row after the last note shows. */
export type ListEnd =
  | { type: "loading" }
  | { type: "error"; message: string; onRetry: () => void }
  | { type: "done"; count: number };

type NoteRowData = {
  notes: Note[];
  totalCount: number;
  end: ListEnd;
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
};

export const NoteRow = ({
  ariaAttributes,
  index,
  style,
  notes,
  totalCount,
  end,
  handleNoteClick,
}: RowComponentProps<NoteRowData>) => {
  if (index === notes.length) {
    // Not a note, so not a list item for screen readers.
    return (
      <div role="none" style={style} className={styles.end}>
        {end.type === "loading" && <span role="status">Loading more…</span>}
        {end.type === "error" && (
          <>
            <span role="alert">{end.message}</span>
            <button type="button" onClick={end.onRetry}>
              Try again
            </button>
          </>
        )}
        {end.type === "done" && end.count > 0 && (
          <span>
            That's all {end.count === 1 ? "1 note" : `${end.count} notes`}.
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      {...ariaAttributes}
      // Position among all notes, also those not loaded yet.
      aria-setsize={totalCount}
      style={style}
    >
      <NoteItem note={notes[index]} handleNoteClick={handleNoteClick} />
    </div>
  );
};
