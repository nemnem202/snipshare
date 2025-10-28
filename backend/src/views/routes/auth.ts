import { Router } from "express";

const auth = Router();

auth.post("/login", (req, res) => res.sendStatus(200));

auth.post("/register", (req, res) => res.sendStatus(200));

auth.get("/session", (req, res) => res.sendStatus(200));

export default auth;
