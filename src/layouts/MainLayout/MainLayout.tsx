import { Outlet } from "react-router-dom";

import { Header } from "../Header/Header";
import styles from "./MainLayout.module.scss";
import { Footer } from "../Footer/Footer/Footer";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
