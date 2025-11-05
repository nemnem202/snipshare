import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./core/router";
import "./ui/style/global.css";
import "./ui/style/general.css";
import SessionProvider from "./provider/session_provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <Router />
    </SessionProvider>
  </StrictMode>
);
