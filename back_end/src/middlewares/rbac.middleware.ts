import type { NextFunction, Request, Response } from "express";
import type { Role } from "../shared/constants/roles";
import { forbidden, unauthorized } from "../shared/errors";

export function authorizeRoles(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(unauthorized());
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(forbidden("Insufficient role"));
      return;
    }

    next();
  };
}
