import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upload } from "../../middleware/upload.middleware";
import { createTaskSchema, updateTaskSchema, updateStatusSchema } from "./task.schema";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  patchTaskStatus,
  deleteTask,
  uploadAttachment,
  deleteAttachment,
  listComments,
  addComment,
  deleteComment,
} from "./task.controller";

const router = Router();

router.get("/", authenticate, listTasks);
router.get("/:id", authenticate, getTask);
router.post("/", authenticate, validate(createTaskSchema), createTask);
router.patch("/:id", authenticate, validate(updateTaskSchema), updateTask);
router.patch("/:id/status", authenticate, validate(updateStatusSchema), patchTaskStatus);
router.delete("/:id", authenticate, deleteTask);

// Attachments
router.post("/:id/attachments", authenticate, upload.single("file"), uploadAttachment);
router.delete("/:id/attachments/:attachmentId", authenticate, deleteAttachment);

// Comments
router.get("/:id/comments", authenticate, listComments);
router.post("/:id/comments", authenticate, addComment);
router.delete("/:id/comments/:commentId", authenticate, deleteComment);

export default router;
