import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import type { CreateTeamInput, UpdateTeamInput, AddMemberInput, UpdateMemberRoleInput } from "./team.schema";

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

async function list(filters: { projectId?: string; search?: string }) {
  const where: Record<string, unknown> = {};
  if (filters.projectId) where["projectId"] = filters.projectId;
  if (filters.search) where["name"] = { contains: filters.search, mode: "insensitive" };

  return prisma.team.findMany({
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

async function findById(id: string) {
  const team = await prisma.team.findUnique({
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
  if (!team) throw new ApiError(404, "Team not found");
  return team;
}

async function create(data: CreateTeamInput) {
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) throw new ApiError(404, "Project not found");

  return prisma.team.create({
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

async function update(id: string, data: UpdateTeamInput) {
  const existing = await prisma.team.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Team not found");

  return prisma.team.update({
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

async function remove(id: string) {
  const existing = await prisma.team.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Team not found");
  await prisma.team.delete({ where: { id } });
}

async function addMember(teamId: string, data: AddMemberInput) {
  const [team, user] = await Promise.all([
    prisma.team.findUnique({ where: { id: teamId } }),
    prisma.user.findUnique({ where: { id: data.userId } }),
  ]);
  if (!team) throw new ApiError(404, "Team not found");
  if (!user) throw new ApiError(404, "User not found");

  const existing = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: data.userId } },
  });
  if (existing) throw new ApiError(409, "User is already a member of this team");

  return prisma.teamMember.create({
    data: { teamId, userId: data.userId, role: data.role },
    include: MEMBER_USER_SELECT,
  });
}

async function updateMemberRole(teamId: string, memberId: string, data: UpdateMemberRoleInput) {
  const member = await prisma.teamMember.findFirst({ where: { id: memberId, teamId } });
  if (!member) throw new ApiError(404, "Team member not found");

  return prisma.teamMember.update({
    where: { id: memberId },
    data: { role: data.role },
    include: MEMBER_USER_SELECT,
  });
}

async function removeMember(teamId: string, memberId: string) {
  const member = await prisma.teamMember.findFirst({ where: { id: memberId, teamId } });
  if (!member) throw new ApiError(404, "Team member not found");
  await prisma.teamMember.delete({ where: { id: memberId } });
}

export const teamService = {
  list,
  findById,
  create,
  update,
  remove,
  addMember,
  updateMemberRole,
  removeMember,
};
