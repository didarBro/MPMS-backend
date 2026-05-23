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
const TASK_LIST_INCLUDE = {
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
};
const TASK_DETAIL_INCLUDE = {
    assignee: { select: { id: true, name: true, email: true, avatar: true } },
    createdBy: { select: { id: true, name: true } },
    sprint: {
        select: {
            id: true,
            name: true,
            sprintNumber: true,
            projectId: true,
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
    comments: {
        where: { parentId: null },
        include: {
            user: { select: { id: true, name: true, avatar: true } },
            replies: {
                include: { user: { select: { id: true, name: true, avatar: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "asc" },
    },
    activityLogs: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
    },
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
        include: TASK_LIST_INCLUDE,
    });
}
async function findById(id, userId, userRole) {
    const task = await db_1.prisma.task.findUnique({ where: { id }, include: TASK_DETAIL_INCLUDE });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    let canApprove = userRole === "ADMIN";
    if (!canApprove && userId && task.sprint?.projectId) {
        const managerMembership = await db_1.prisma.teamMember.findFirst({
            where: {
                userId,
                role: { in: ["MANAGER", "ADMIN"] },
                team: { projectId: task.sprint.projectId },
            },
        });
        if (!managerMembership) {
            const projManagerMembership = await db_1.prisma.projectMember.findFirst({
                where: { userId, projectId: task.sprint.projectId, role: { in: ["MANAGER", "ADMIN"] } },
            });
            canApprove = !!projManagerMembership;
        }
        else {
            canApprove = true;
        }
    }
    return { ...task, canApprove };
}
async function create(data, createdById) {
    const task = await db_1.prisma.task.create({
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
        include: TASK_DETAIL_INCLUDE,
    });
    await db_1.prisma.activityLog.create({
        data: { taskId: task.id, userId: createdById, action: "created", detail: task.title },
    });
    return { ...task, canApprove: true };
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
        include: TASK_DETAIL_INCLUDE,
    });
}
async function updateStatus(id, data, userId, userRole) {
    const existing = await db_1.prisma.task.findUnique({
        where: { id },
        select: { status: true, sprintId: true, sprint: { select: { projectId: true } } },
    });
    if (!existing)
        throw new ApiError_1.ApiError(404, "Task not found");
    if (data.status === "DONE" && userRole !== "ADMIN") {
        const projectId = existing.sprint?.projectId;
        if (projectId) {
            const teamManager = await db_1.prisma.teamMember.findFirst({
                where: { userId, role: { in: ["MANAGER", "ADMIN"] }, team: { projectId } },
            });
            if (!teamManager) {
                const projManager = await db_1.prisma.projectMember.findFirst({
                    where: { userId, projectId, role: { in: ["MANAGER", "ADMIN"] } },
                });
                if (!projManager) {
                    throw new ApiError_1.ApiError(403, "Only project managers can mark tasks as Done. Submit for review first.");
                }
            }
        }
    }
    const updated = await db_1.prisma.task.update({ where: { id }, data: { status: data.status } });
    await db_1.prisma.activityLog.create({
        data: {
            taskId: id,
            userId,
            action: "status_changed",
            detail: `${existing.status} → ${data.status}`,
        },
    });
    return updated;
}
async function remove(id) {
    const task = await db_1.prisma.task.findUnique({
        where: { id },
        include: { attachments: true },
    });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    for (const att of task.attachments) {
        const filePath = path_1.default.join(__dirname, "..", "uploads", path_1.default.basename(att.url));
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
    return db_1.prisma.task.delete({ where: { id } });
}
async function addAttachment(taskId, file, userId) {
    const task = await db_1.prisma.task.findUnique({ where: { id: taskId } });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    const attachment = await db_1.prisma.attachment.create({
        data: {
            taskId,
            name: file.originalname,
            url: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
        },
    });
    await db_1.prisma.activityLog.create({
        data: { taskId, userId, action: "attachment_added", detail: file.originalname },
    });
    return attachment;
}
async function removeAttachment(taskId, attachmentId, userId) {
    const att = await db_1.prisma.attachment.findUnique({ where: { id: attachmentId } });
    if (!att || att.taskId !== taskId)
        throw new ApiError_1.ApiError(404, "Attachment not found");
    const filePath = path_1.default.join(__dirname, "..", "uploads", path_1.default.basename(att.url));
    if (fs_1.default.existsSync(filePath))
        fs_1.default.unlinkSync(filePath);
    await db_1.prisma.attachment.delete({ where: { id: attachmentId } });
    await db_1.prisma.activityLog.create({
        data: { taskId, userId, action: "attachment_removed", detail: att.name },
    });
}
async function listComments(taskId) {
    return db_1.prisma.comment.findMany({
        where: { taskId, parentId: null },
        include: {
            user: { select: { id: true, name: true, avatar: true } },
            replies: {
                include: { user: { select: { id: true, name: true, avatar: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}
async function addComment(taskId, userId, data) {
    const task = await db_1.prisma.task.findUnique({ where: { id: taskId } });
    if (!task)
        throw new ApiError_1.ApiError(404, "Task not found");
    const comment = await db_1.prisma.comment.create({
        data: { taskId, userId, content: data.content, parentId: data.parentId ?? null },
        include: {
            user: { select: { id: true, name: true, avatar: true } },
            replies: {
                include: { user: { select: { id: true, name: true, avatar: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
    });
    await db_1.prisma.activityLog.create({
        data: {
            taskId,
            userId,
            action: "comment_added",
            detail: data.content.length > 100 ? data.content.substring(0, 100) + "…" : data.content,
        },
    });
    return comment;
}
async function removeComment(commentId, userId, userRole) {
    const comment = await db_1.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment)
        throw new ApiError_1.ApiError(404, "Comment not found");
    if (comment.userId !== userId && userRole !== "ADMIN") {
        throw new ApiError_1.ApiError(403, "Cannot delete another user's comment");
    }
    return db_1.prisma.comment.delete({ where: { id: commentId } });
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
    listComments,
    addComment,
    removeComment,
};
//# sourceMappingURL=task.service.js.map