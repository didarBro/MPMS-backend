import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      (req.cookies as Record<string, string | undefined>)["access_token"] ??
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    req.user = user;
    next();
  }
);

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "Insufficient permissions"));
      return;
    }
    next();
  };
};
