import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

interface PrismaError {
  code: string;
  meta?: { modelName?: string; table?: string; target?: string[] };
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.nodeEnv === "development" && { stack: err.stack }),
    });
    return;
  }

  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as unknown as PrismaError;
    if (prismaErr.code === "P2002") {
      res.status(409).json({
        success: false,
        message: `A record with that ${prismaErr.meta?.target?.join(", ") ?? "value"} already exists`,
      });
      return;
    }

    if (["P2021", "P2022"].includes(prismaErr.code)) {
      res.status(503).json({
        success: false,
        message: "Database schema is not ready. Run Prisma migrations and try again.",
        ...(env.nodeEnv === "development" && { code: prismaErr.code, meta: prismaErr.meta }),
      });
      return;
    }
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({ success: false, message: "Token expired" });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};
