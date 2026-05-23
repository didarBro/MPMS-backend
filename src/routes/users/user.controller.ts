import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import { userService } from "./user.service";
import type { CreateUserInput, UpdateUserInput } from "./user.schema";

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const { search, role, department, isActive } = req.query as Record<string, string | undefined>;
  const users = await userService.list({ search, role, department, isActive });
  sendSuccess(res, users);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.findById(String(req.params["id"]));
  sendSuccess(res, user);
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.create(req.body as CreateUserInput);
  sendSuccess(res, user, "User created", 201);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.update(String(req.params["id"]), req.body as UpdateUserInput);
  sendSuccess(res, user, "User updated");
});

export const changeUserPassword = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body as { password: string };
  await userService.changePassword(String(req.params["id"]), password);
  sendSuccess(res, null, "Password updated");
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.remove(String(req.params["id"]));
  sendSuccess(res, null, "User deleted");
});
