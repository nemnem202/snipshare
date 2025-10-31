import { Router } from "express";

const code = Router();

code.post("", (req, res) => res.sendStatus(200));

export default code;
