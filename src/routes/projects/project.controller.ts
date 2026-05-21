import type { Request, Response } from "express";
import { projectService } from "./project.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendSuccess } from "../../utils/response.js";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema.js";

export const listProjects = catchAsync(async (req: Request, res: Response) => {
  const { status, client, search } = req.query as Record<string, string | undefined>;
  const projects = await projectService.list({ status, client, search });
  sendSuccess(res, projects);
});

export const getProject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.findById(String(req.params["id"]));
  sendSuccess(res, project);
});

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.create(req.body as CreateProjectInput);
  sendSuccess(res, project, "Project created", 201);
});

export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.update(String(req.params["id"]), req.body as UpdateProjectInput);
  sendSuccess(res, project, "Project updated");
});

export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  await projectService.remove(String(req.params["id"]));
  sendSuccess(res, null, "Project deleted");
});
