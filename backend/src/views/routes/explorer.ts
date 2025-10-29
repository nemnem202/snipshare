import { Router } from "express";

const explorer = Router();

explorer.get("/pages_number", (_, res) => res.sendStatus(200));

explorer.get("/comments/:snippet_id", (req, res) => res.sendStatus(200));

explorer.get("/", (_, res) => res.sendStatus(200));

export default explorer;
