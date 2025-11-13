import express from "express";
import { setupSwagger } from "../../doc/swagger";
import router from "../routing/router";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Custom } from "../lib/tools/logger";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: `http://${process.env.SERVER_IP}:${process.env.FRONTEND_PORT}`,
    credentials: true,
  })
);

Custom.log("cors", `allowed for http://${process.env.SERVER_IP}:${process.env.FRONTEND_PORT}`);

app.use(router);

setupSwagger(app);

export default app;
