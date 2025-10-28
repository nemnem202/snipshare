import { Router } from "express";

const explorer = Router();

explorer.get("/", (_, res) => res.sendStatus(200));

export default explorer;
