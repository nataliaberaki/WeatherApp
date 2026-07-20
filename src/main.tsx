import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// StrictMode highlights unsafe React behavior during development.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
