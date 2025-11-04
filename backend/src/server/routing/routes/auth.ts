import { Router } from "express";
import AuthController from "../../controllers/authController";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";

const auth = Router();

auth.post("/login", (req, res) => AuthController.login(req, res));

auth.post("/register", (req, res) => AuthController.register(req, res));

auth.get("/session", (req, res) => res.sendStatus(200));

auth.delete(
  "/session",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

auth.delete(
  "/account",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

export default auth;
