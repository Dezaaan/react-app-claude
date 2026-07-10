import type { HTMLAttributes, LiHTMLAttributes } from "react";

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  orientation?: "row" | "column";
  variant?: "default" | "grid" | "horizontal";
};

export type ListItemProps = LiHTMLAttributes<HTMLLIElement> & {
  variant?: "default" | "card";
};
