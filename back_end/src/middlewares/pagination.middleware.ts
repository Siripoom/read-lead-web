import type { NextFunction, Request, Response } from "express";

export function pagination(req: Request, _res: Response, next: NextFunction): void {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 20);

  req.pagination = {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: Number.isInteger(pageSize) && pageSize > 0 && pageSize <= 100 ? pageSize : 20,
  };

  next();
}
