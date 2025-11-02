import { Router } from "express";
import AuthController from "../../controllers/authController";

const auth = Router();

auth.post("/login", (req, res) => res.sendStatus(200));

auth.post("/register", (req, res) => AuthController.login(req, res));

auth.get("/session", (req, res) => res.sendStatus(200));

export default auth;
