import { useState } from "react";

import styles from "./NoteItem.module.scss";
import { cn } from "@/shared/utils/cn";

interface NoteItemProps {
  title: string;
  description: string;
}

export const NoteItem = ({ title, description }: NoteItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        className={cn(styles.button, expanded && styles.active)}
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {title}
      </button>

      {expanded && <p className={styles.description}>{description}</p>}
    </>
  );
};
