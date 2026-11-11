import { setupWorker } from "msw/browser";

import { handlers, isMockScenario, scenarios } from "./handlers";

export const startMockWorker = async () => {
  const worker = setupWorker(...handlers);

  await worker.start({
    // Let requests the mocks don't know about (Vite, assets) through.
    onUnhandledFrame: "bypass",
  });

  const scenario = new URLSearchParams(window.location.search).get("mock");
  if (isMockScenario(scenario)) {
    worker.use(...scenarios[scenario]);
    console.info(`[mocks] Using "${scenario}" scenario until reload.`);
  }
};
