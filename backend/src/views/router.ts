import { Router } from "express";
import explorer from "./routes/explorer";
import dashboard from "./routes/dashboard";
import AuthMiddleware from "../lib/middlewares/authMiddleware";
import auth from "./routes/auth";
import social from "./routes/social";
import snippet from "./routes/snippet";
import code from "./routes/code";

const router = Router();

router.use("/auth", auth);
router.use("/explorer", explorer);
router.use("/code", code);
router.use("/dashboard", (req, res, next) => AuthMiddleware.protectUser(req, res, next), dashboard);
router.use("/social", (req, res, next) => AuthMiddleware.protectUser(req, res, next), social);
router.use("/snippet", (req, res, next) => AuthMiddleware.protectUser(req, res, next), snippet);

export default router;
