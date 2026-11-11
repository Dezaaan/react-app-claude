import { LoginForm } from "@/features/auth/components/LoginForm/LoginForm";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Login</h1>

        <p>Please enter your credentials to log in.</p>

        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
