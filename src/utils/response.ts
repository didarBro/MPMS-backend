import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): void => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message = "Internal Server Error",
  statusCode = 500
): void => {
  res.status(statusCode).json({ success: false, message });
};
