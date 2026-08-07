import styles from "./NotesPage.module.scss";
import { NotesFeature } from "@/features/notes/components/NotesFeature/NotesFeature";

const NotesPage = () => {
  return (
    <div className={styles.container}>
      <h1>Notes</h1>

      <NotesFeature />
    </div>
  );
};

export default NotesPage;
