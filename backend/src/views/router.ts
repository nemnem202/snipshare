import { Router } from "express";
import explorer from "./routes/explorer";

const router = Router();

router.use("/explorer", explorer);

export default router;
