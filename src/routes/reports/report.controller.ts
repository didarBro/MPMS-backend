import type { Request, Response } from "express";
import { reportService } from "./report.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";

export const getReports = catchAsync(async (_req: Request, res: Response) => {
  const [summary, projects, users] = await Promise.all([
    reportService.getSummary(),
    reportService.getProjectReports(),
    reportService.getUserReports(),
  ]);
  sendSuccess(res, { summary, projects, users });
});
