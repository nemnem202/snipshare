import express from "express";
import { setupSwagger } from "../../doc/swagger";
import router from "../routing/router";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:" + process.env.FRONTEND_PORT],
    credentials: true,
  })
);

app.use(router);

setupSwagger(app);

export default app;
