import type { Request, Response } from "express";
import type { CrudService } from "./crud.service";
import { created, ok } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export function createCrudController(service: CrudService) {
  return {
    list: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.list(req.query as Record<string, unknown>);
      ok(res, result.data, undefined, result.meta);
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
      const data = await service.getById(req.params.id);
      ok(res, data);
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const data = await service.create(req.body);
      created(res, data);
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const data = await service.update(req.params.id, req.body);
      ok(res, data);
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.remove(req.params.id);
      ok(res, result.data, result.message);
    }),
  };
}
