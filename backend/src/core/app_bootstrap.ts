import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";

configDotenv({ quiet: true });

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express + TypeScript!");
});

const PORT = process.env.PORT;

if (PORT) {
  app.listen(PORT, () => {
    console.warn("[STARTUP] : app is running on port", PORT, ".");
  });
} else {
  console.error("[STARTUP] : port is not defined in environnement.");
}
