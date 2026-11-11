import type { MouseEventHandler } from "react";
import { type RowComponentProps } from "react-window";
import type { Note } from "../../types";
import { NoteItem } from "../NoteItem/NoteItem";

type NoteRowData = {
  notes: Note[];
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
};

export const NoteRow = ({
  index,
  style,
  notes,
  handleNoteClick,
}: RowComponentProps<NoteRowData>) => {
  const note = notes[index];
  return (
    <div style={style}>
      <NoteItem note={note} handleNoteClick={handleNoteClick} />
    </div>
  );
};
