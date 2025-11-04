import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";

const social = Router();

social.post(
  "/comment/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

social.get(
  "/like/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

social.get(
  "/unlike/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

export default social;
