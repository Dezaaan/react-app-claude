import { Navigation } from "@/navigation";
import styles from "./Header.module.scss";

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
