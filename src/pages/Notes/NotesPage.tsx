import styles from "./NotesPage.module.scss";
import type { notesLoader } from "@/features/notes/loaders/notesLoader";
import { NotesTable } from "@/features/notes/components/NotesTable/NotesTable";
import { useLoaderData } from "react-router-dom";

const NotesPage = () => {
  const { notes } = useLoaderData<typeof notesLoader>();
  return (
    <div className={styles.container}>
      <h1>Notes</h1>

      <NotesTable notes={notes} />
    </div>
  );
};

export default NotesPage;
