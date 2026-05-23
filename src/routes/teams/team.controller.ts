import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import { teamService } from "./team.service";
import type { CreateTeamInput, UpdateTeamInput, AddMemberInput, UpdateMemberRoleInput } from "./team.schema";

export const listTeams = catchAsync(async (req: Request, res: Response) => {
  const { projectId, search } = req.query as Record<string, string | undefined>;
  const teams = await teamService.list({ projectId, search });
  sendSuccess(res, teams);
});

export const getTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await teamService.findById(String(req.params["id"]));
  sendSuccess(res, team);
});

export const createTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await teamService.create(req.body as CreateTeamInput);
  sendSuccess(res, team, "Team created", 201);
});

export const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await teamService.update(String(req.params["id"]), req.body as UpdateTeamInput);
  sendSuccess(res, team, "Team updated");
});

export const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  await teamService.remove(String(req.params["id"]));
  sendSuccess(res, null, "Team deleted");
});

export const addTeamMember = catchAsync(async (req: Request, res: Response) => {
  const member = await teamService.addMember(String(req.params["id"]), req.body as AddMemberInput);
  sendSuccess(res, member, "Member added", 201);
});

export const updateTeamMemberRole = catchAsync(async (req: Request, res: Response) => {
  const member = await teamService.updateMemberRole(
    String(req.params["id"]),
    String(req.params["memberId"]),
    req.body as UpdateMemberRoleInput
  );
  sendSuccess(res, member, "Role updated");
});

export const removeTeamMember = catchAsync(async (req: Request, res: Response) => {
  await teamService.removeMember(String(req.params["id"]), String(req.params["memberId"]));
  sendSuccess(res, null, "Member removed");
});
