import { Custom } from "../lib/tools/logger";
import app from "./app";

const PORT = process.env.PORT;

if (PORT) {
  app.listen(PORT, () => {
    Custom.warn("startup", `app is running on port ${PORT}.`);
    Custom.warn("doc", `Swagger docs available at http://localhost:${PORT}/docs`);
  });
} else {
  console.error("[STARTUP] : port is not defined in environnement.");
}
