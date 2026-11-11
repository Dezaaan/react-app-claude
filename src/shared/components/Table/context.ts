import { createContext } from "react";

/**
 * Lets Table.Body tell the Table how wide its vertical scrollbar is, so the
 * header can leave the same space and the columns line up. The width is 0
 * when the rows fit (no scrollbar) and with overlay scrollbars (macOS).
 */
export const TableScrollbarContext = createContext<(width: number) => void>(
  () => {},
);
