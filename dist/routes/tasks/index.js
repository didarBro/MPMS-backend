"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const task_schema_1 = require("./task.schema");
const task_controller_1 = require("./task.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, task_controller_1.listTasks);
router.get("/:id", auth_middleware_1.authenticate, task_controller_1.getTask);
router.post("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(task_schema_1.createTaskSchema), task_controller_1.createTask);
router.patch("/:id", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(task_schema_1.updateTaskSchema), task_controller_1.updateTask);
router.patch("/:id/status", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(task_schema_1.updateStatusSchema), task_controller_1.patchTaskStatus);
router.delete("/:id", auth_middleware_1.authenticate, task_controller_1.deleteTask);
// Attachments
router.post("/:id/attachments", auth_middleware_1.authenticate, upload_middleware_1.upload.single("file"), task_controller_1.uploadAttachment);
router.delete("/:id/attachments/:attachmentId", auth_middleware_1.authenticate, task_controller_1.deleteAttachment);
exports.default = router;
//# sourceMappingURL=index.js.map