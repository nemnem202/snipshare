import { Custom } from "../lib/tools/logger";
import app from "./app";
import { db, env } from "../config/env";

const run = () => {
  Custom.log("env", db, env);

  app.listen(env.port, () => {
    Custom.warn("startup", `app is running on port ${env.port}.`);
    Custom.warn("doc", `Swagger docs available at http://localhost:${env.port}/docs`);
  });
};

run();
