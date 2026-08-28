import styles from "./Footer.module.scss";
import { FooterColumn } from "./FooterColumn/FooterColumn";
import { List } from "@/shared/components/List";
import { footerConfig } from "./footer-config";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <List variant="grid" className={styles.container}>
        {footerConfig.map((column) => (
          <FooterColumn key={column.id} column={column} />
        ))}
      </List>
    </footer>
  );
};
