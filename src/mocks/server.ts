import { setupServer } from "msw/node";

import { handlers } from "./handlers";

/** The mock API for Vitest. */
export const server = setupServer(...handlers);
