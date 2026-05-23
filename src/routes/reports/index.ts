import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getReports } from "./report.controller";

const router = Router();

router.get("/", authenticate, getReports);

export default router;
