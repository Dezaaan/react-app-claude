import type { ReactNode } from "react";

export interface NavigationProps {
  children?: ReactNode;
}

export interface NavigationItemProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
