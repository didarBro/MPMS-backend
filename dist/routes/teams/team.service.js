"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const MEMBER_USER_SELECT = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            department: true,
            skills: true,
            role: true,
            isActive: true,
        },
    },
};
async function list(filters) {
    const where = {};
    if (filters.projectId)
        where["projectId"] = filters.projectId;
    if (filters.search)
        where["name"] = { contains: filters.search, mode: "insensitive" };
    return db_1.prisma.team.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            project: { select: { id: true, name: true } },
            _count: { select: { members: true } },
            members: {
                take: 5,
                orderBy: { createdAt: "asc" },
                include: {
                    user: { select: { id: true, name: true, avatar: true } },
                },
            },
        },
    });
}
async function findById(id) {
    const team = await db_1.prisma.team.findUnique({
        where: { id },
        include: {
            project: { select: { id: true, name: true } },
            members: {
                orderBy: { createdAt: "asc" },
                include: MEMBER_USER_SELECT,
            },
            _count: { select: { members: true } },
        },
    });
    if (!team)
        throw new ApiError_1.ApiError(404, "Team not found");
    return team;
}
async function create(data) {
    const project = await db_1.prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project)
        throw new ApiError_1.ApiError(404, "Project not found");
    return db_1.prisma.team.create({
        data: {
            name: data.name,
            description: data.description,
            projectId: data.projectId,
        },
        include: {
            project: { select: { id: true, name: true } },
            _count: { select: { members: true } },
            members: { include: MEMBER_USER_SELECT },
        },
    });
}
async function update(id, data) {
    const existing = await db_1.prisma.team.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "Team not found");
    return db_1.prisma.team.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description ?? null }),
        },
        include: {
            project: { select: { id: true, name: true } },
            _count: { select: { members: true } },
            members: { include: MEMBER_USER_SELECT },
        },
    });
}
async function remove(id) {
    const existing = await db_1.prisma.team.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "Team not found");
    await db_1.prisma.team.delete({ where: { id } });
}
async function addMember(teamId, data) {
    const [team, user] = await Promise.all([
        db_1.prisma.team.findUnique({ where: { id: teamId } }),
        db_1.prisma.user.findUnique({ where: { id: data.userId } }),
    ]);
    if (!team)
        throw new ApiError_1.ApiError(404, "Team not found");
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    const existing = await db_1.prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId, userId: data.userId } },
    });
    if (existing)
        throw new ApiError_1.ApiError(409, "User is already a member of this team");
    return db_1.prisma.teamMember.create({
        data: { teamId, userId: data.userId, role: data.role },
        include: MEMBER_USER_SELECT,
    });
}
async function updateMemberRole(teamId, memberId, data) {
    const member = await db_1.prisma.teamMember.findFirst({ where: { id: memberId, teamId } });
    if (!member)
        throw new ApiError_1.ApiError(404, "Team member not found");
    return db_1.prisma.teamMember.update({
        where: { id: memberId },
        data: { role: data.role },
        include: MEMBER_USER_SELECT,
    });
}
async function removeMember(teamId, memberId) {
    const member = await db_1.prisma.teamMember.findFirst({ where: { id: memberId, teamId } });
    if (!member)
        throw new ApiError_1.ApiError(404, "Team member not found");
    await db_1.prisma.teamMember.delete({ where: { id: memberId } });
}
exports.teamService = {
    list,
    findById,
    create,
    update,
    remove,
    addMember,
    updateMemberRole,
    removeMember,
};
//# sourceMappingURL=team.service.js.map