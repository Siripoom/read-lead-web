import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../libs/jwt";
import { unauthorized } from "../shared/errors";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(unauthorized("Missing bearer token"));
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const claims = verifyAccessToken(token);

  req.user = {
    userId: claims.sub,
    role: claims.role,
    tokenType: claims.tokenType,
    jti: claims.jti,
  };

  next();
}
