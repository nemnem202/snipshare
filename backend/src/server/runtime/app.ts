import express from "express";
import { setupSwagger } from "../../doc/swagger";
import router from "../routing/router";

const app = express();

app.use(express.json());

app.use(router);

setupSwagger(app);

export default app;
