import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";

const dashboard = Router();

dashboard.put(
  "/change-username/:id",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

dashboard.get(
  "/pages_number",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

dashboard.get(
  "/:page",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => res.sendStatus(200)
);

export default dashboard;
