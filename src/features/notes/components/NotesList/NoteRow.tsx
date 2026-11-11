import type { MouseEventHandler } from "react";
import { type RowComponentProps } from "react-window";
import type { Note } from "@/features/notes/types";
import { NoteItem } from "@/features/notes/components/NoteItem/NoteItem";

type NoteRowData = {
  notes: Note[];
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
};

export const NoteRow = ({
  ariaAttributes,
  index,
  style,
  notes,
  handleNoteClick,
}: RowComponentProps<NoteRowData>) => {
  const note = notes[index];
  return (
    <div {...ariaAttributes} style={style}>
      <NoteItem note={note} handleNoteClick={handleNoteClick} />
    </div>
  );
};
