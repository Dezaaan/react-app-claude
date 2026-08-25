import "./index.css";
import { AppRouter } from "./router/AppRouter";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <AppRouter />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export default App;
