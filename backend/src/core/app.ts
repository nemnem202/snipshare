import { configDotenv } from "dotenv";
import express from "express";
import router from "../views/router";
import { setupSwagger } from "./swagger";

configDotenv({ quiet: true });

const app = express();

app.use(express.json());

app.use(router);

setupSwagger(app);

export default app;
