// frontend/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AreaProvider } from "./context/AreaContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AreaProvider>
      <App />
    </AreaProvider>
  </StrictMode>
);
