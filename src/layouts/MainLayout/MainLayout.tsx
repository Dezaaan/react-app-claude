import { Outlet } from "react-router-dom";

import { Header } from "../Header/Header";
import styles from "./MainLayout.module.scss";
import { Footer } from "../Footer/Footer";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.content}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
