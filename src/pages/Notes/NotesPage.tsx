import { useLoaderData } from "react-router-dom";

import { NotesTable } from "@/features/notes/components/NotesTable/NotesTable";
import type { notesPageLoader } from "@/features/notes/loaders/notesPageLoader";
import styles from "./NotesPage.module.scss";

const NotesPage = () => {
  const { notes } = useLoaderData<typeof notesPageLoader>();

  return (
    <div className={styles.container}>
      <h1>Notes</h1>

      <NotesTable notes={notes} />
    </div>
  );
};

export default NotesPage;
