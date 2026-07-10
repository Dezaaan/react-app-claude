import { Outlet } from "react-router-dom";

import { Header } from "./Header/Header";
import styles from "./MainLayout.module.scss";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
