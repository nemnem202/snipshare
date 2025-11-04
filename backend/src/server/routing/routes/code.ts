import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";

const code = Router();

code.post(
  "",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

export default code;
