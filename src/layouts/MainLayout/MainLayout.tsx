import { Outlet } from "react-router-dom";

import { Header } from "@/layouts/Header/Header";
import styles from "./MainLayout.module.scss";
import { Footer } from "@/layouts/Footer/Footer";

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
