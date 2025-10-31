import fs from "fs";
import path from "path";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
export const setupSwagger = (app: express.Express) => {
  const filePath = path.resolve("src/doc/openapi.yml");
  let yamlText = fs.readFileSync(filePath, "utf8");

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
