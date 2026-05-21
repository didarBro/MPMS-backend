import { Router } from "express";
import authRouter from "./auth/index.js";
import projectRouter from "./projects/index.js";
import sprintRouter from "./sprints/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/sprints", sprintRouter);

export default router;
