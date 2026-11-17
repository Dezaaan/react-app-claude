import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

import { PageHeader } from "@/layouts/PageHeader/PageHeader";
import { notesQueries } from "@/features/notes/api/notesQueries";
import { NotesTable } from "@/features/notes/components/NotesTable/NotesTable";
import type { notesPageLoader } from "@/features/notes/loaders/notesPageLoader";
import styles from "./NotesPage.module.scss";

const NotesPage = () => {
  const { query } = useLoaderData<typeof notesPageLoader>();
  // The loader already put this in the cache, so it never waits here.
  // Stale data is refetched in the background and the table updates.
  const { data: notes } = useSuspenseQuery(notesQueries.list(query));

  return (
    <div className={styles.container}>
      <PageHeader />

      <NotesTable notes={notes} />
    </div>
  );
};

export default NotesPage;
