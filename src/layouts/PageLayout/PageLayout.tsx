import { Outlet, useNavigation } from "react-router-dom";
import styles from "./PageLayout.module.scss";

export const PageLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <p>Loading page...</p> : <Outlet />}
      </div>
    </main>
  );
};
