import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "./project.schema.js";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./project.controller.js";

const router = Router();

router.get("/", authenticate, listProjects);
router.get("/:id", authenticate, getProject);
router.post("/", authenticate, authorize("ADMIN"), validate(createProjectSchema), createProject);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateProjectSchema), updateProject);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProject);

export default router;
