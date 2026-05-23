import { Router } from "express";
import authRouter from "./auth/index.js";
import projectRouter from "./projects/index.js";
import sprintRouter from "./sprints/index.js";
import taskRouter from "./tasks/index.js";
import userRouter from "./users/index.js";
import teamRouter from "./teams/index.js";
import reportRouter from "./reports/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/sprints", sprintRouter);
router.use("/tasks", taskRouter);
router.use("/users", userRouter);
router.use("/teams", teamRouter);
router.use("/reports", reportRouter);

export default router;
