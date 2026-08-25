import styles from "./Header.module.scss";
import { Navigation } from "@/navigation";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Navigation>
          <Navigation.Links />
          <Navigation.Menu />
        </Navigation>
      </div>
    </header>
  );
};
