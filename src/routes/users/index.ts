import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createUserSchema, updateUserSchema, changePasswordSchema } from "./user.schema";
import * as userController from "./user.controller";

const router = Router();

router.get("/", authenticate, userController.listUsers);
router.get("/:id", authenticate, userController.getUser);
router.post("/", authenticate, authorize("ADMIN"), validate(createUserSchema), userController.createUser);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateUserSchema), userController.updateUser);
router.patch("/:id/password", authenticate, authorize("ADMIN"), validate(changePasswordSchema), userController.changeUserPassword);
router.delete("/:id", authenticate, authorize("ADMIN"), userController.deleteUser);

export default router;
