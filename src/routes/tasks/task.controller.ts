import type { Request, Response } from "express";
import { taskService } from "./task.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import { ApiError } from "../../utils/ApiError";
import type { CreateTaskInput, UpdateTaskInput, UpdateStatusInput } from "./task.schema";
import type { AuthUser } from "../../types/index.d";

export const listTasks = catchAsync(async (req: Request, res: Response) => {
  const { projectId, sprintId, assigneeId, status, priority, search } =
    req.query as Record<string, string | undefined>;
  const tasks = await taskService.list({ projectId, sprintId, assigneeId, status, priority, search });
  sendSuccess(res, tasks);
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const task = await taskService.findById(String(req.params["id"]), user.id, user.role);
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
  const user = req.user as AuthUser;
  const task = await taskService.updateStatus(
    String(req.params["id"]),
    req.body as UpdateStatusInput,
    user.id,
    user.role
  );
  sendSuccess(res, task, "Status updated");
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await taskService.remove(String(req.params["id"]));
  sendSuccess(res, null, "Task deleted");
});

export const uploadAttachment = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw new ApiError(400, "No file provided");
  const user = req.user as AuthUser;
  const attachment = await taskService.addAttachment(String(req.params["id"]), file, user.id);
  sendSuccess(res, attachment, "Attachment uploaded", 201);
});

export const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await taskService.removeAttachment(
    String(req.params["id"]),
    String(req.params["attachmentId"]),
    user.id
  );
  sendSuccess(res, null, "Attachment deleted");
});

export const listComments = catchAsync(async (req: Request, res: Response) => {
  const comments = await taskService.listComments(String(req.params["id"]));
  sendSuccess(res, comments);
});

export const addComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { content, parentId } = req.body as { content: string; parentId?: string };
  if (!content?.trim()) throw new ApiError(400, "Comment content is required");
  const comment = await taskService.addComment(String(req.params["id"]), user.id, {
    content: content.trim(),
    parentId,
  });
  sendSuccess(res, comment, "Comment added", 201);
});

export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await taskService.removeComment(
    String(req.params["commentId"]),
    user.id,
    user.role
  );
  sendSuccess(res, null, "Comment deleted");
});
