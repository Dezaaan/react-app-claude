import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

import { REDIRECT_PARAM } from "../../redirects";
import type { LoginActionData } from "../../routes/login";
import styles from "./LoginForm.module.scss";

/**
 * Submits to the login route's action. React Router handles the request:
 * no local state for the fields, loading, or the error.
 */
export const LoginForm = () => {
  const actionData = useActionData<LoginActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className={styles.form} noValidate>
      {/* Where to go after logging in, read by the action. */}
      <input
        type="hidden"
        name={REDIRECT_PARAM}
        value={searchParams.get(REDIRECT_PARAM) ?? ""}
      />

      <label className={styles.field}>
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={actionData?.error ? true : undefined}
          aria-describedby={actionData?.error ? "login-error" : undefined}
        />
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          aria-invalid={actionData?.error ? true : undefined}
          aria-describedby={actionData?.error ? "login-error" : undefined}
        />
      </label>

      {actionData?.error && (
        <p id="login-error" role="alert" className={styles.error}>
          {actionData.error}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </Form>
  );
};
