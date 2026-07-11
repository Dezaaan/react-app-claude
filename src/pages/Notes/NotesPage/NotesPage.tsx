// pages/NotesPage/NotesPage.tsx

import { List, ListItem } from "@/shared/components/List";
import { NoteItem } from "../NoteItem/NoteItem";

import styles from "./NotesPage.module.scss";

const notes = [
  {
    id: 1,
    title: "Shopping",
    description: "Buy groceries and household items.",
  },
  {
    id: 2,
    title: "Workout",
    description: "Complete the gym routine for today.",
  },
  {
    id: 3,
    title: "Meeting",
    description: "Discuss project progress with the team.",
  },
];

const NotesPage = () => {
  return (
    <div className={styles.container}>
      <h1>Notes</h1>

      <List>
        {notes.map((note) => (
          <ListItem key={note.id} direction="card">
            <NoteItem {...note} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NotesPage;
