import type { ReactNode } from "react";

export interface NavigationProps {
  children?: ReactNode;
}

export interface NavigationItemProps {
  to: string;
  children: ReactNode;
  className?: string;
  /** Replaces the default style for the link of the current page. */
  activeClassName?: string;
  onClick?: () => void;
}
