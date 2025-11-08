import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";
import SnippetController from "../../controllers/snippetController";

const snippet = Router();

snippet.post(
  "/new",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => SnippetController.addNewSnippet(req, res)
);

snippet.post(
  "/:snippet_id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => SnippetController.changeSnippet(req, res)
);

snippet.get("/unref/:path", (req, res) => res.sendStatus(200));

export default snippet;
