import { LoginForm } from "@/features/auth/components/LoginForm/LoginForm";
import { PageHeader } from "@/layouts/PageHeader/PageHeader";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <PageHeader />

        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
