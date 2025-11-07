import { Router } from "express";
import ExplorerController from "../../controllers/explorerController";
import AuthMiddleware from "../../lib/middlewares/authMiddleware";

const explorer = Router();

explorer.get("/languages", (req, res) => ExplorerController.getAvailablesLanguages(req, res));

explorer.get("/pages_number", (req, res) => ExplorerController.getPageNumber(req, res));

explorer.get(
  "/:page_index",
  (req, res, next) => AuthMiddleware.getUserId(req, res, next),
  (req, res) => ExplorerController.getAPage(req, res)
);

export default explorer;
