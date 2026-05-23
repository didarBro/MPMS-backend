import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema.js";

async function list(filters: { status?: string; client?: string; search?: string; userId?: string }) {
  const where: Record<string, unknown> = {};
  if (filters.status) where["status"] = filters.status;
  if (filters.client) where["client"] = { contains: filters.client, mode: "insensitive" };
  if (filters.search) where["name"] = { contains: filters.search, mode: "insensitive" };
  if (filters.userId) {
    where["OR"] = [
      { members: { some: { userId: filters.userId } } },
      { teams: { some: { members: { some: { userId: filters.userId } } } } },
    ];
  }

  const projects = await prisma.project.findMany({
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

async function findById(id: string) {
  const project = await prisma.project.findUnique({
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
  if (!project) throw new ApiError(404, "Project not found");
  return project;
}

async function create(data: CreateProjectInput) {
  return prisma.project.create({
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

async function update(id: string, data: UpdateProjectInput) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Project not found");

  return prisma.project.update({
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

async function remove(id: string) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Project not found");
  return prisma.project.delete({ where: { id } });
}

export const projectService = { list, findById, create, update, remove };
