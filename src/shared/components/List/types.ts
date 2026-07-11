import type { HTMLAttributes, LiHTMLAttributes } from "react";

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  layout?: "default" | "grid" | "horizontal" | "vertical";
};

export type ListItemProps = LiHTMLAttributes<HTMLLIElement> & {
  direction?: "default" | "card";
};
