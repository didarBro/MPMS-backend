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
import { createSprintSchema, reorderSchema } from "../sprints/sprint.schema.js";
import {
  listProjectSprints,
  createSprint,
  reorderSprints,
} from "../sprints/sprint.controller.js";

const router = Router();

router.get("/", authenticate, listProjects);
router.get("/:id", authenticate, getProject);
router.post("/", authenticate, authorize("ADMIN"), validate(createProjectSchema), createProject);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateProjectSchema), updateProject);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProject);

// Nested sprint routes
router.get("/:projectId/sprints", authenticate, listProjectSprints);
router.post("/:projectId/sprints", authenticate, authorize("ADMIN"), validate(createSprintSchema), createSprint);
router.patch("/:projectId/sprints/reorder", authenticate, authorize("ADMIN"), validate(reorderSchema), reorderSprints);

export default router;
