import { useState } from "react";

import styles from "./NoteItem.module.scss";

interface NoteItemProps {
  title: string;
  description: string;
}

export const NoteItem = ({ title, description }: NoteItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.item}>
      <button
        className={styles.button}
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {title}
      </button>

      {expanded && <p className={styles.description}>{description}</p>}
    </div>
  );
};
