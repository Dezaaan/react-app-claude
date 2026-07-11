import styles from "./FooterColumn.module.scss";

import type { FooterColumn as FooterColumnType } from "../types";
import { List, ListItem } from "@/shared/components/List";

type FooterColumnProps = {
  column: FooterColumnType;
};

export const FooterColumn = ({ column }: FooterColumnProps) => {
  return (
    <section className={styles.column}>
      <h3>{column.title}</h3>

      <List>
        {column.items.map(({ id, label }) => (
          <ListItem key={id}>{label}</ListItem>
        ))}
      </List>
    </section>
  );
};
