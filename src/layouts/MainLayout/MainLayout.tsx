import { Outlet, useNavigation } from "react-router-dom";

import { Header } from "../Header/Header";
import styles from "./MainLayout.module.scss";
import { Footer } from "../Footer/Footer/Footer";

const MainLayout = () => {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  return (
    <div className={styles.layout}>
      <Header />

      <main>{isLoading ? <p>Loading page...</p> : <Outlet />}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
