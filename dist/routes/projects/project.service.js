"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const db_js_1 = require("../../config/db.js");
const ApiError_js_1 = require("../../utils/ApiError.js");
async function list(filters) {
    const where = {};
    if (filters.status)
        where["status"] = filters.status;
    if (filters.client)
        where["client"] = { contains: filters.client, mode: "insensitive" };
    if (filters.search)
        where["name"] = { contains: filters.search, mode: "insensitive" };
    const projects = await db_js_1.prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { sprints: true, members: true } },
            sprints: {
                include: { tasks: { select: { status: true } } },
            },
        },
    });
    return projects.map((p) => {
        const allTasks = p.sprints.flatMap((s) => s.tasks);
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter((t) => t.status === "DONE").length;
        const { sprints: _s, ...rest } = p;
        return { ...rest, totalTasks, completedTasks };
    });
}
async function findById(id) {
    const project = await db_js_1.prisma.project.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
                },
            },
            sprints: {
                orderBy: { createdAt: "asc" },
                include: {
                    tasks: {
                        orderBy: { createdAt: "desc" },
                        include: {
                            assignee: { select: { id: true, name: true, avatar: true } },
                        },
                    },
                },
            },
            _count: { select: { members: true, sprints: true } },
        },
    });
    if (!project)
        throw new ApiError_js_1.ApiError(404, "Project not found");
    return project;
}
async function create(data) {
    return db_js_1.prisma.project.create({
        data: {
            name: data.name,
            client: data.client,
            description: data.description,
            status: data.status,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            budget: data.budget,
            thumbnail: data.thumbnail,
        },
    });
}
async function update(id, data) {
    const existing = await db_js_1.prisma.project.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_js_1.ApiError(404, "Project not found");
    return db_js_1.prisma.project.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.client !== undefined && { client: data.client ?? null }),
            ...(data.description !== undefined && { description: data.description ?? null }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.startDate !== undefined && {
                startDate: data.startDate ? new Date(data.startDate) : null,
            }),
            ...(data.endDate !== undefined && {
                endDate: data.endDate ? new Date(data.endDate) : null,
            }),
            ...(data.budget !== undefined && { budget: data.budget ?? null }),
            ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail ?? null }),
        },
    });
}
async function remove(id) {
    const existing = await db_js_1.prisma.project.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_js_1.ApiError(404, "Project not found");
    return db_js_1.prisma.project.delete({ where: { id } });
}
exports.projectService = { list, findById, create, update, remove };
//# sourceMappingURL=project.service.js.map