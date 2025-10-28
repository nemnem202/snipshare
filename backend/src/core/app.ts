import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import router from "../views/router";

configDotenv({ quiet: true });

const app = express();

app.use(express.json());

app.use(router);

export default app;
