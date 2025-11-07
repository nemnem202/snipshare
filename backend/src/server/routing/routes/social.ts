import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";
import SocialController from "../../controllers/socialController";

const social = Router();

social.post(
  "/comment/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

social.get("/comment/:snippet_id", (req, res) => SocialController.getCommentsForSnippet(req, res));

social.get(
  "/like/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => SocialController.likeSnippet(req, res)
);

social.get(
  "/unlike/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => SocialController.unlikeSnippet(req, res)
);

export default social;
