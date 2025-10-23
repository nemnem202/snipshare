import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./core/router";
import "./ui/style/global.css";
import { Button } from "./ui/assets/button";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Button>Coucou</Button>
    <Button variant="destructive">Coucou</Button>
    <Button variant="ghost" className="transition-all duration-700 ease-in-out">
      Coucou
    </Button>
    <Button variant="link">Coucou</Button>
    <Button variant="outline">Coucou</Button>
    <Button variant="secondary">Coucou</Button>
    <Router />
  </StrictMode>
);
