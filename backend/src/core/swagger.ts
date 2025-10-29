import fs from "fs";
import path from "path";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { env } from "../config/env";
export const setupSwagger = (app: express.Express) => {
  const filePath = path.join(__dirname, "../doc/openapi.yml");
  let yamlText = fs.readFileSync(filePath, "utf8");

  yamlText = yamlText.replace(/\${PORT}/g, env.port);

  const swaggerDocument = YAML.parse(yamlText);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "API Documentation",
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
};
