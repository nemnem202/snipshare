import { Router } from "express";

const snippet = Router();

snippet.post("/new", (req, res) => res.sendStatus(200));

snippet.put("/:id", (req, res) => res.sendStatus(200));

snippet.get("/unref/:path", (req, res) => res.sendStatus(200));

export default snippet;
