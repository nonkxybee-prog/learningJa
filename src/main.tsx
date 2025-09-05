import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/your-repo-name"> {/* Replace with your GitHub repository name */}
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
