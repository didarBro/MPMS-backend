import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createSprintSchema, updateSprintSchema, reorderSchema } from "./sprint.schema.js";
import {
  listSprints,
  updateSprint,
  deleteSprint,
} from "./sprint.controller.js";

// Standalone sprint routes (mounted at /sprints)
const router = Router();

router.get("/", authenticate, listSprints);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateSprintSchema), updateSprint);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteSprint);

export default router;
