import type { Request, Response } from "express";
import { taskService } from "./task.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import type { CreateTaskInput, UpdateTaskInput, UpdateStatusInput } from "./task.schema";
import type { AuthUser } from "../../types/index.d";

export const listTasks = catchAsync(async (req: Request, res: Response) => {
  const { projectId, sprintId, assigneeId, status, priority, search } =
    req.query as Record<string, string | undefined>;
  const tasks = await taskService.list({ projectId, sprintId, assigneeId, status, priority, search });
  sendSuccess(res, tasks);
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.findById(String(req.params["id"]));
  sendSuccess(res, task);
});

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const task = await taskService.create(req.body as CreateTaskInput, user.id);
  sendSuccess(res, task, "Task created", 201);
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.update(String(req.params["id"]), req.body as UpdateTaskInput);
  sendSuccess(res, task, "Task updated");
});

export const patchTaskStatus = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.updateStatus(
    String(req.params["id"]),
    req.body as UpdateStatusInput
  );
  sendSuccess(res, task, "Status updated");
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await taskService.remove(String(req.params["id"]));
  sendSuccess(res, null, "Task deleted");
});

export const uploadAttachment = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, message: "No file provided" });
    return;
  }
  const attachment = await taskService.addAttachment(String(req.params["id"]), file);
  sendSuccess(res, attachment, "Attachment uploaded", 201);
});

export const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
  await taskService.removeAttachment(
    String(req.params["id"]),
    String(req.params["attachmentId"])
  );
  sendSuccess(res, null, "Attachment deleted");
});
