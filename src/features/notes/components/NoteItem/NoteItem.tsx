import styles from "./NoteItem.module.scss";

interface NoteItemProps {
  title: string;
}

export const NoteItem = ({ title }: NoteItemProps) => {
  return (
    <button className={styles.button} type="button">
      {title}
    </button>
  );
};
