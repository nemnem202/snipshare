import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";
import PistonController from "../../controllers/pistonController";

const code = Router();

code.post(
  "",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => PistonController.post(req, res)
);

export default code;
