import express from "express";
import { setupSwagger } from "../../doc/swagger";
import router from "../routing/router";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(router);

setupSwagger(app);

export default app;
