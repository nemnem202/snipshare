import { Custom } from "../lib/tools/logger";
import app from "./app";

const PORT = 3000;

const run = () => {
  app.listen(PORT, () => {
    Custom.warn("startup", `app is running on port ${PORT}.`);
    Custom.warn("doc", `Swagger docs available at http://localhost:${PORT}/docs`);
  });
};

run();
