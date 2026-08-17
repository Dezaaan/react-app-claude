// Table.tsx

import styles from "./Table.module.scss";
import type { ReactNode } from "react";
import { TableHeader } from "./TableHeader/TableHeader";
import { TableBody } from "./TableBody/TableBody";

type TableProps = {
  children: ReactNode;
};

export const Table = ({ children }: TableProps) => {
  return <div className={styles.table}>{children}</div>;
};

Table.Header = TableHeader;
Table.Body = TableBody;
