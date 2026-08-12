import type { CSSProperties, MouseEventHandler } from "react";
import { type RowComponentProps } from "react-window";
import type { Note } from "../../types";
import { NoteItem } from "../NoteItem/NoteItem";

export type NoteRowProps = {
  index: number;
  style: CSSProperties;
  notes: Note[];
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
};

export const NoteRow = ({
  index,
  style,
  notes,
  handleNoteClick,
}: RowComponentProps<{
  notes: Note[];
  handleNoteClick: MouseEventHandler<HTMLButtonElement>;
}>) => {
  const note = notes[index];
  return (
    <div style={style}>
      <NoteItem note={note} handleNoteClick={handleNoteClick} />
    </div>
  );
};
