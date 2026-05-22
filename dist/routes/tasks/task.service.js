"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
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
async function list(filters) {
    const where = { parentId: null };
    if (filters.status)
        where["status"] = filters.status;
    if (filters.priority)
        where["priority"] = filters.priority;
    if (filters.assigneeId)
        where["assigneeId"] = filters.assigneeId;
    if (filters.search)
        where["title"] = { contains: filters.search, mode: "insensitive" };
    if (filters.sprintId) {
        where["sprintId"] = filters.sprintId;
    }
    else if (filters.projectId) {
        where["sprint"] = { projectId: filters.projectId };
    }
    return db_1.prisma.task.findMany({
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
async function findById(id) {
    const task = await db_1.prisma.task.findUnique({ where: { id }, include: TASK_INCLUDE });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    return task;
}
async function create(data, createdById) {
    return db_1.prisma.task.create({
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
async function update(id, data) {
    const existing = await db_1.prisma.task.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "Task not found");
    return db_1.prisma.task.update({
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
async function updateStatus(id, data) {
    const existing = await db_1.prisma.task.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "Task not found");
    return db_1.prisma.task.update({ where: { id }, data: { status: data.status } });
}
async function remove(id) {
    const task = await db_1.prisma.task.findUnique({
        where: { id },
        include: { attachments: true },
    });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    // Delete attachment files from disk
    for (const att of task.attachments) {
        const filePath = path_1.default.join(__dirname, "..", "uploads", path_1.default.basename(att.url));
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
    return db_1.prisma.task.delete({ where: { id } });
}
async function addAttachment(taskId, file) {
    const task = await db_1.prisma.task.findUnique({ where: { id: taskId } });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    return db_1.prisma.attachment.create({
        data: {
            taskId,
            name: file.originalname,
            url: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
        },
    });
}
async function removeAttachment(taskId, attachmentId) {
    const att = await db_1.prisma.attachment.findUnique({ where: { id: attachmentId } });
    if (!att || att.taskId !== taskId)
        throw new ApiError_1.ApiError(404, "Attachment not found");
    const filePath = path_1.default.join(__dirname, "..", "uploads", path_1.default.basename(att.url));
    if (fs_1.default.existsSync(filePath))
        fs_1.default.unlinkSync(filePath);
    return db_1.prisma.attachment.delete({ where: { id: attachmentId } });
}
exports.taskService = {
    list,
    findById,
    create,
    update,
    updateStatus,
    remove,
    addAttachment,
    removeAttachment,
};
//# sourceMappingURL=task.service.js.map