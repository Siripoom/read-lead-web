import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { AppError } from "../shared/errors";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        error: {
          code: "UNIQUE_CONSTRAINT",
          message: "Duplicate value",
          details: error.meta,
        },
      });
      return;
    }

    res.status(400).json({
      error: {
        code: "PRISMA_ERROR",
        message: error.message,
      },
    });
    return;
  }

  logger.error({ err: error }, "Unhandled error");

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: env.NODE_ENV === "production" ? "Unexpected server error" : String(error),
    },
  });
}
