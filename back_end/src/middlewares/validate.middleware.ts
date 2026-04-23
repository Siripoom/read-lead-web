import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { badRequest } from "../shared/errors";

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(options: ValidateOptions) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, unknown> = {};

    if (options.body) {
      const parsed = options.body.safeParse(req.body);
      if (!parsed.success) {
        errors.body = parsed.error.flatten();
      } else {
        req.body = parsed.data;
      }
    }

    if (options.query) {
      const parsed = options.query.safeParse(req.query);
      if (!parsed.success) {
        errors.query = parsed.error.flatten();
      } else {
        req.query = parsed.data;
      }
    }

    if (options.params) {
      const parsed = options.params.safeParse(req.params);
      if (!parsed.success) {
        errors.params = parsed.error.flatten();
      } else {
        req.params = parsed.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      next(badRequest("Validation failed", errors));
      return;
    }

    next();
  };
}
