import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import * as authService from "./auth.service";
import { env } from "../../config/env";
import type { RegisterInput, LoginInput } from "./auth.schema";

const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000;

const COOKIE_BASE = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax" as const,
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string, role: string): void {
  res.cookie("access_token", accessToken, { ...COOKIE_BASE, maxAge: ACCESS_TTL });
  res.cookie("refresh_token", refreshToken, { ...COOKIE_BASE, maxAge: REFRESH_TTL });
  res.cookie("user_role", role, {
    httpOnly: false,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: ACCESS_TTL,
  });
}

function clearAuthCookies(res: Response): void {
  res.clearCookie("access_token", COOKIE_BASE);
  res.clearCookie("refresh_token", COOKIE_BASE);
  res.clearCookie("user_role");
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body as RegisterInput);
  setAuthCookies(res, accessToken, refreshToken, user.role);
  sendSuccess(res, { user, accessToken }, "Registration successful", 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body as LoginInput);
  setAuthCookies(res, accessToken, refreshToken, user.role);
  sendSuccess(res, { user, accessToken }, "Login successful");
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = (req.cookies as Record<string, string | undefined>)["refresh_token"];
  if (!token) {
    res.status(401).json({ success: false, message: "Refresh token not found" });
    return;
  }
  const { accessToken, refreshToken } = await authService.refreshTokens(token);
  setAuthCookies(res, accessToken, refreshToken, "");
  sendSuccess(res, { accessToken }, "Token refreshed");
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const token = (req.cookies as Record<string, string | undefined>)["refresh_token"];
  if (token) await authService.logout(token);
  clearAuthCookies(res);
  sendSuccess(res, null, "Logged out successfully");
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, { user }, "User fetched");
});
