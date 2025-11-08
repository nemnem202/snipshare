import { Router } from "express";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";
import DashboardController from "../../controllers/dashboardController";

const dashboard = Router();

dashboard.post(
  "/change-username",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => DashboardController.changeUsername(req, res)
);

dashboard.get(
  "/pages_number",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => DashboardController.getPageNumber(req, res)
);

dashboard.get(
  "/:page_index",
  (req, res, next) => AuthMiddleware.protectUser(req, res, next),
  (req, res) => DashboardController.getAPage(req, res)
);

export default dashboard;
