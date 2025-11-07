import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";
import SnippetController from "../../controllers/snippetController";

const snippet = Router();

snippet.post(
  "/new",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => SnippetController.addNewSnippet(req, res)
);

snippet.put("/:id", (req, res) => res.sendStatus(200));

snippet.get("/unref/:path", (req, res) => res.sendStatus(200));

export default snippet;
