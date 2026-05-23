import { prisma } from "../../config/db";

async function getSummary() {
  const [projectStats, taskStats, timeAgg] = await Promise.all([
    prisma.project.groupBy({ by: ["status"], _count: true }),
    prisma.task.groupBy({ by: ["status"], where: { parentId: null }, _count: true }),
    prisma.timeLog.aggregate({ _sum: { hours: true } }),
  ]);

  const totalProjects = projectStats.reduce((s, r) => s + r._count, 0);
  const activeProjects = projectStats.find((r) => r.status === "ACTIVE")?._count ?? 0;
  const totalTasks = taskStats.reduce((s, r) => s + r._count, 0);
  const completedTasks = taskStats.find((r) => r.status === "DONE")?._count ?? 0;
  const totalLoggedHours = Math.round((timeAgg._sum.hours ?? 0) * 10) / 10;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { totalProjects, activeProjects, totalTasks, completedTasks, totalLoggedHours, overallProgress };
}

async function getProjectReports() {
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      client: true,
      status: true,
      budget: true,
      startDate: true,
      endDate: true,
      sprints: {
        select: {
          tasks: {
            where: { parentId: null },
            select: {
              status: true,
              priority: true,
              estimate: true,
              timeLogs: { select: { hours: true } },
            },
          },
        },
      },
    },
  });

  return projects.map((p) => {
    const tasks = p.sprints.flatMap((s) => s.tasks);
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "DONE").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const inReviewTasks = tasks.filter((t) => t.status === "IN_REVIEW").length;
    const todoTasks = tasks.filter((t) => t.status === "TODO").length;
    const percentComplete = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const estimatedHours = Math.round(tasks.reduce((s, t) => s + (t.estimate ?? 0), 0) * 10) / 10;
    const loggedHours =
      Math.round(
        tasks.flatMap((t) => t.timeLogs).reduce((s, l) => s + l.hours, 0) * 10
      ) / 10;

    const { sprints: _s, ...rest } = p;
    return {
      ...rest,
      totalTasks,
      doneTasks,
      inProgressTasks,
      inReviewTasks,
      todoTasks,
      percentComplete,
      estimatedHours,
      loggedHours,
    };
  });
}

async function getUserReports() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      assignedTasks: {
        where: { parentId: null },
        select: { status: true, priority: true },
      },
      timeLogs: { select: { hours: true } },
    },
  });

  return users.map((u) => {
    const tasks = u.assignedTasks;
    const totalAssigned = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const criticalOpen = tasks.filter(
      (t) => t.priority === "CRITICAL" && t.status !== "DONE"
    ).length;
    const loggedHours =
      Math.round(u.timeLogs.reduce((s, l) => s + l.hours, 0) * 10) / 10;
    const completionRate =
      totalAssigned > 0 ? Math.round((completedTasks / totalAssigned) * 100) : 0;

    const { assignedTasks: _at, timeLogs: _tl, ...rest } = u;
    return {
      ...rest,
      totalAssigned,
      completedTasks,
      inProgressTasks,
      criticalOpen,
      loggedHours,
      completionRate,
    };
  });
}

export const reportService = { getSummary, getProjectReports, getUserReports };
