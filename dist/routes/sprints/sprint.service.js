"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sprintService = void 0;
const db_js_1 = require("../../config/db.js");
const ApiError_js_1 = require("../../utils/ApiError.js");
async function list(filters) {
    const where = {};
    if (filters.projectId)
        where["projectId"] = filters.projectId;
    if (filters.status)
        where["status"] = filters.status;
    return db_js_1.prisma.sprint.findMany({
        where,
        orderBy: [{ projectId: "asc" }, { order: "asc" }],
        include: {
            project: { select: { id: true, name: true, client: true } },
            _count: { select: { tasks: true } },
        },
    });
}
async function listByProject(projectId) {
    const project = await db_js_1.prisma.project.findUnique({ where: { id: projectId } });
    if (!project)
        throw new ApiError_js_1.ApiError(404, "Project not found");
    return db_js_1.prisma.sprint.findMany({
        where: { projectId },
        orderBy: { order: "asc" },
        include: {
            _count: { select: { tasks: true } },
            tasks: { select: { status: true } },
        },
    });
}
async function create(projectId, data) {
    const project = await db_js_1.prisma.project.findUnique({ where: { id: projectId } });
    if (!project)
        throw new ApiError_js_1.ApiError(404, "Project not found");
    const [maxOrder, sprintCount] = await Promise.all([
        db_js_1.prisma.sprint.aggregate({
            where: { projectId },
            _max: { order: true },
        }),
        db_js_1.prisma.sprint.count({ where: { projectId } }),
    ]);
    const order = (maxOrder._max.order ?? 0) + 1;
    const sprintNumber = sprintCount + 1;
    return db_js_1.prisma.sprint.create({
        data: {
            name: data.name,
            sprintNumber,
            goal: data.goal,
            status: data.status,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            order,
            projectId,
        },
        include: {
            _count: { select: { tasks: true } },
        },
    });
}
async function update(id, data) {
    const sprint = await db_js_1.prisma.sprint.findUnique({ where: { id } });
    if (!sprint)
        throw new ApiError_js_1.ApiError(404, "Sprint not found");
    return db_js_1.prisma.sprint.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.goal !== undefined && { goal: data.goal ?? null }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.startDate !== undefined && {
                startDate: data.startDate ? new Date(data.startDate) : null,
            }),
            ...(data.endDate !== undefined && {
                endDate: data.endDate ? new Date(data.endDate) : null,
            }),
        },
        include: { _count: { select: { tasks: true } } },
    });
}
async function remove(id) {
    const sprint = await db_js_1.prisma.sprint.findUnique({ where: { id } });
    if (!sprint)
        throw new ApiError_js_1.ApiError(404, "Sprint not found");
    return db_js_1.prisma.sprint.delete({ where: { id } });
}
async function reorder(projectId, data) {
    const project = await db_js_1.prisma.project.findUnique({ where: { id: projectId } });
    if (!project)
        throw new ApiError_js_1.ApiError(404, "Project not found");
    await db_js_1.prisma.$transaction(data.orderedIds.map((id, index) => db_js_1.prisma.sprint.update({
        where: { id },
        data: { order: index + 1 },
    })));
}
exports.sprintService = { list, listByProject, create, update, remove, reorder };
//# sourceMappingURL=sprint.service.js.map