import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import path from "path";
import express from "express";

const swaggerDocument = YAML.load(path.join(__dirname, "../doc/openapi.yml"));

export const setupSwagger = (app: express.Express) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "API Documentation",
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
};
