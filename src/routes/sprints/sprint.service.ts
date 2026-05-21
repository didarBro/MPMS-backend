import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateSprintInput, UpdateSprintInput, ReorderInput } from "./sprint.schema.js";

async function list(filters: { projectId?: string; status?: string }) {
  const where: Record<string, unknown> = {};
  if (filters.projectId) where["projectId"] = filters.projectId;
  if (filters.status) where["status"] = filters.status;

  return prisma.sprint.findMany({
    where,
    orderBy: [{ projectId: "asc" }, { order: "asc" }],
    include: {
      project: { select: { id: true, name: true, client: true } },
      _count: { select: { tasks: true } },
    },
  });
}

async function listByProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new ApiError(404, "Project not found");

  return prisma.sprint.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { tasks: true } },
      tasks: { select: { status: true } },
    },
  });
}

async function create(projectId: string, data: CreateSprintInput) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new ApiError(404, "Project not found");

  const [maxOrder, sprintCount] = await Promise.all([
    prisma.sprint.aggregate({
      where: { projectId },
      _max: { order: true },
    }),
    prisma.sprint.count({ where: { projectId } }),
  ]);

  const order = (maxOrder._max.order ?? 0) + 1;
  const sprintNumber = sprintCount + 1;

  return prisma.sprint.create({
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

async function update(id: string, data: UpdateSprintInput) {
  const sprint = await prisma.sprint.findUnique({ where: { id } });
  if (!sprint) throw new ApiError(404, "Sprint not found");

  return prisma.sprint.update({
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

async function remove(id: string) {
  const sprint = await prisma.sprint.findUnique({ where: { id } });
  if (!sprint) throw new ApiError(404, "Sprint not found");
  return prisma.sprint.delete({ where: { id } });
}

async function reorder(projectId: string, data: ReorderInput) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new ApiError(404, "Project not found");

  await prisma.$transaction(
    data.orderedIds.map((id, index) =>
      prisma.sprint.update({
        where: { id },
        data: { order: index + 1 },
      })
    )
  );
}

export const sprintService = { list, listByProject, create, update, remove, reorder };
