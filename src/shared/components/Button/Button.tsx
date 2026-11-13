import type { ComponentPropsWithRef } from "react";

import { cn } from "@/shared/utils/cn";
import styles from "./Button.module.scss";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  /**
   * primary: the main action of a form or dialog (one per screen area).
   * secondary: everything else, e.g. Cancel, Try again.
   * danger: destructive actions, e.g. Delete.
   */
  variant?: "primary" | "secondary" | "danger";
  size?: "md" | "sm";
};

/** A button in the app's style. Defaults to type="button", not "submit". */
export const Button = ({
  variant = "secondary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(styles.button, styles[variant], styles[size], className)}
    {...props}
  />
);
