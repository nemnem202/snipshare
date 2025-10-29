import { Router } from "express";

const dashboard = Router();

dashboard.put("/change-username/:id", (req, res) => res.sendStatus(200));

dashboard.get("/liked/pages_number", (req, res) => res.sendStatus(200));

dashboard.get("/personals/pages_number", (req, res) => res.sendStatus(200));

dashboard.get("/liked/:page", (req, res) => res.sendStatus(200));

dashboard.get("/personals/:page", (req, res) => res.sendStatus(200));

export default dashboard;
