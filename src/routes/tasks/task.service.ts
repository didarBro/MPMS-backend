import path from "path";
import fs from "fs";
import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import type { CreateTaskInput, UpdateTaskInput, UpdateStatusInput } from "./task.schema";

const TASK_INCLUDE = {
  assignee: { select: { id: true, name: true, email: true, avatar: true } },
  createdBy: { select: { id: true, name: true } },
  sprint: {
    select: {
      id: true,
      name: true,
      sprintNumber: true,
      project: { select: { id: true, name: true } },
    },
  },
  subtasks: {
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      assigneeId: true,
      assignee: { select: { id: true, name: true, avatar: true } },
    },
    where: { parentId: { not: null } },
  },
  attachments: true,
  _count: { select: { subtasks: true, attachments: true, timeLogs: true } },
};

async function list(filters: {
  projectId?: string;
  sprintId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = { parentId: null };

  if (filters.status) where["status"] = filters.status;
  if (filters.priority) where["priority"] = filters.priority;
  if (filters.assigneeId) where["assigneeId"] = filters.assigneeId;
  if (filters.search) where["title"] = { contains: filters.search, mode: "insensitive" };

  if (filters.sprintId) {
    where["sprintId"] = filters.sprintId;
  } else if (filters.projectId) {
    where["sprint"] = { projectId: filters.projectId };
  }

  return prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      assignee: { select: { id: true, name: true, avatar: true } },
      sprint: {
        select: {
          id: true,
          name: true,
          sprintNumber: true,
          project: { select: { id: true, name: true } },
        },
      },
      _count: { select: { subtasks: true, attachments: true } },
    },
  });
}

async function findById(id: string) {
  const task = await prisma.task.findUnique({ where: { id }, include: TASK_INCLUDE });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

async function create(data: CreateTaskInput, createdById: string) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      storyPoints: data.storyPoints,
      estimate: data.estimate,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      sprintId: data.sprintId ?? null,
      assigneeId: data.assigneeId ?? null,
      parentId: data.parentId ?? null,
      createdById,
    },
    include: TASK_INCLUDE,
  });
}

async function update(id: string, data: UpdateTaskInput) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Task not found");

  return prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description ?? null }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.storyPoints !== undefined && { storyPoints: data.storyPoints ?? null }),
      ...(data.estimate !== undefined && { estimate: data.estimate ?? null }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
      ...(data.sprintId !== undefined && { sprintId: data.sprintId ?? null }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId ?? null }),
      ...(data.parentId !== undefined && { parentId: data.parentId ?? null }),
    },
    include: TASK_INCLUDE,
  });
}

async function updateStatus(id: string, data: UpdateStatusInput) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Task not found");
  return prisma.task.update({ where: { id }, data: { status: data.status } });
}

async function remove(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { attachments: true },
  });
  if (!task) throw new ApiError(404, "Task not found");

  // Delete attachment files from disk
  for (const att of task.attachments) {
    const filePath = path.join(__dirname, "..", "uploads", path.basename(att.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  return prisma.task.delete({ where: { id } });
}

async function addAttachment(
  taskId: string,
  file: { originalname: string; filename: string; mimetype: string; size: number }
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new ApiError(404, "Task not found");

  return prisma.attachment.create({
    data: {
      taskId,
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
}

async function removeAttachment(taskId: string, attachmentId: string) {
  const att = await prisma.attachment.findUnique({ where: { id: attachmentId } });
  if (!att || att.taskId !== taskId) throw new ApiError(404, "Attachment not found");

  const filePath = path.join(__dirname, "..", "uploads", path.basename(att.url));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return prisma.attachment.delete({ where: { id: attachmentId } });
}

export const taskService = {
  list,
  findById,
  create,
  update,
  updateStatus,
  remove,
  addAttachment,
  removeAttachment,
};
