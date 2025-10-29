import { Router } from "express";

const social = Router();

social.post("/comment/:snippet_id", (req, res) => res.sendStatus(200));

social.get("/like/:snippet_id", (req, res) => res.sendStatus(200));

social.get("/unlike/:snippet_id", (req, res) => res.sendStatus(200));

export default social;
