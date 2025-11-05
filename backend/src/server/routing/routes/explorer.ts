import { Router } from "express";
import ExplorerController from "../../controllers/explorerController";

const explorer = Router();

explorer.get("/pages_number", (req, res) => ExplorerController.getPageNumber(req, res));

explorer.get("/:page_index", (req, res) => ExplorerController.getAPage(req, res));

export default explorer;
