import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { created, ok } from "../../shared/utils/api-response";
import * as authService from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  created(res, result, "Registered successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  ok(res, result, "Login successful");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body.refreshToken);
  ok(res, result, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  ok(res, { success: true }, "Logged out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.me(req.user!.userId);
  ok(res, result);
});
