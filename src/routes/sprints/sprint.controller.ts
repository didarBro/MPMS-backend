import type { Request, Response } from "express";
import { sprintService } from "./sprint.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendSuccess } from "../../utils/response.js";
import type { CreateSprintInput, UpdateSprintInput, ReorderInput } from "./sprint.schema.js";

// GET /sprints?projectId=&status=
export const listSprints = catchAsync(async (req: Request, res: Response) => {
  const { projectId, status } = req.query as Record<string, string | undefined>;
  const sprints = await sprintService.list({ projectId, status });
  sendSuccess(res, sprints);
});

// GET /projects/:projectId/sprints
export const listProjectSprints = catchAsync(async (req: Request, res: Response) => {
  const sprints = await sprintService.listByProject(String(req.params["projectId"]));
  sendSuccess(res, sprints);
});

// POST /projects/:projectId/sprints
export const createSprint = catchAsync(async (req: Request, res: Response) => {
  const sprint = await sprintService.create(
    String(req.params["projectId"]),
    req.body as CreateSprintInput
  );
  sendSuccess(res, sprint, "Sprint created", 201);
});

// PATCH /sprints/:id
export const updateSprint = catchAsync(async (req: Request, res: Response) => {
  const sprint = await sprintService.update(
    String(req.params["id"]),
    req.body as UpdateSprintInput
  );
  sendSuccess(res, sprint, "Sprint updated");
});

// DELETE /sprints/:id
export const deleteSprint = catchAsync(async (req: Request, res: Response) => {
  await sprintService.remove(String(req.params["id"]));
  sendSuccess(res, null, "Sprint deleted");
});

// PATCH /projects/:projectId/sprints/reorder
export const reorderSprints = catchAsync(async (req: Request, res: Response) => {
  await sprintService.reorder(
    String(req.params["projectId"]),
    req.body as ReorderInput
  );
  sendSuccess(res, null, "Sprints reordered");
});
