import app from "./app";

const PORT = process.env.PORT;

if (PORT) {
  app.listen(PORT, () => {
    console.warn("[STARTUP] : app is running on port", PORT, ".");
    console.warn(`[DOC] : Swagger docs available at http://localhost:${PORT}/docs`);
  });
} else {
  console.error("[STARTUP] : port is not defined in environnement.");
}
