import { Router } from "express";
import authRouter from "./auth/index.js";
import projectRouter from "./projects/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/projects", projectRouter);

export default router;
