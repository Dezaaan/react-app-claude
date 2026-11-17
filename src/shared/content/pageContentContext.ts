import { createContext, useContext } from "react";

import type { PageContent } from "./types";

/** The content of the page being shown (route config `content`). */
export const PageContentContext = createContext<PageContent | undefined>(
  undefined,
);

export const usePageContent = () => useContext(PageContentContext);
