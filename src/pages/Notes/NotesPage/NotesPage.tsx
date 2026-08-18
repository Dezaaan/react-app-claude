import { NotesTable } from "@/features/notes/components/NotesTable/NotesTable";
import styles from "./NotesPage.module.scss";

const NotesPage = () => {
  return (
    <div className={styles.container}>
      <h1>Notes</h1>

      <NotesTable />
    </div>
  );
};

export default NotesPage;
