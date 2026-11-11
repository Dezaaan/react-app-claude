import "./app/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";

// Mock API in development, unless VITE_API_MOCKS=false (e.g. against a real
// backend). The dynamic import keeps MSW out of the production bundle.
const enableMocking = async () => {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_MOCKS === "false") {
    return;
  }

  const { startMockWorker } = await import("./mocks/browser");
  await startMockWorker();
};

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
