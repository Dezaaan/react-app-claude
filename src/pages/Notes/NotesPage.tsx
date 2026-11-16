import { useLoaderData } from "react-router-dom";

import { PageHeader } from "@/layouts/PageHeader/PageHeader";
import { NotesTable } from "@/features/notes/components/NotesTable/NotesTable";
import type { notesPageLoader } from "@/features/notes/loaders/notesPageLoader";
import styles from "./NotesPage.module.scss";

const NotesPage = () => {
  const { notes } = useLoaderData<typeof notesPageLoader>();

  return (
    <div className={styles.container}>
      <PageHeader />

      <NotesTable notes={notes} />
    </div>
  );
};

export default NotesPage;
