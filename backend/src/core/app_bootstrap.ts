import { Custom } from "../lib/tools/logger";
import app from "./app";
import { db } from "../config/env";

const PORT = 3000;

const run = () => {
  Custom.log("env", db);

  app.listen(PORT, () => {
    Custom.warn("startup", `app is running on port ${PORT}.`);
    Custom.warn("doc", `Swagger docs available at http://localhost:${PORT}/docs`);
  });
};

run();
