import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createTeamSchema, updateTeamSchema, addMemberSchema, updateMemberRoleSchema } from "./team.schema";
import * as teamController from "./team.controller";

const router = Router();

router.get("/", authenticate, teamController.listTeams);
router.get("/:id", authenticate, teamController.getTeam);
router.post("/", authenticate, authorize("ADMIN"), validate(createTeamSchema), teamController.createTeam);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateTeamSchema), teamController.updateTeam);
router.delete("/:id", authenticate, authorize("ADMIN"), teamController.deleteTeam);

router.post("/:id/members", authenticate, authorize("ADMIN"), validate(addMemberSchema), teamController.addTeamMember);
router.patch("/:id/members/:memberId", authenticate, authorize("ADMIN"), validate(updateMemberRoleSchema), teamController.updateTeamMemberRole);
router.delete("/:id/members/:memberId", authenticate, authorize("ADMIN"), teamController.removeTeamMember);

export default router;
