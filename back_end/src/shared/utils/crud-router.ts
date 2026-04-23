import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import type { CrudResourceConfig } from "../../modules/resource-config";
import { badRequest, notFound } from "../errors";
import { asyncHandler } from "./async-handler";
import { created, ok } from "./api-response";
import { parseQueryOptions } from "./query";

const createSchema = z.record(z.any());
const updateSchema = z.record(z.any()).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

function parseId(raw: string, idType: CrudResourceConfig["idType"]): string | bigint {
  if (idType === "uuid") {
    return raw;
  }
  if (!/^\d+$/.test(raw)) {
    throw badRequest("Invalid id");
  }
  return BigInt(raw);
}

export function buildCrudRouter(config: CrudResourceConfig): Router {
  const router = Router();

  router.get(
    "/",
    requireAuth,
    authorizeRoles(config.permissions.list),
    pagination,
    asyncHandler(async (req, res) => {
      const delegate = (prisma as Record<string, any>)[config.model];
      const options = parseQueryOptions(req.query as Record<string, unknown>, config.defaultSortBy ?? config.idField);

      const where: Record<string, unknown> = {
        ...(config.softDeleteField ? { [config.softDeleteField]: null } : {}),
        ...Object.fromEntries(Object.entries(options.filters).map(([k, v]) => [k, v])),
      };

      if (options.q && config.searchFields && config.searchFields.length > 0) {
        where.OR = config.searchFields.map((field) => ({
          [field]: {
            contains: options.q,
            mode: "insensitive",
          },
        }));
      }

      const [data, total] = await Promise.all([
        delegate.findMany({
          where,
          skip: options.skip,
          take: options.pageSize,
          orderBy: {
            [options.sortBy]: options.sortOrder,
          },
        }),
        delegate.count({ where }),
      ]);

      ok(res, data, undefined, {
        page: options.page,
        pageSize: options.pageSize,
        total,
        totalPages: Math.ceil(total / options.pageSize),
      });
    }),
  );

  router.get(
    "/:id",
    requireAuth,
    authorizeRoles(config.permissions.get),
    asyncHandler(async (req, res) => {
      const id = parseId(req.params.id, config.idType);
      const delegate = (prisma as Record<string, any>)[config.model];

      const where = {
        [config.idField]: id,
        ...(config.softDeleteField ? { [config.softDeleteField]: null } : {}),
      };

      const data = await delegate.findFirst({ where });
      if (!data) {
        throw notFound();
      }

      ok(res, data);
    }),
  );

  router.post(
    "/",
    requireAuth,
    authorizeRoles(config.permissions.create),
    validate({ body: createSchema }),
    asyncHandler(async (req, res) => {
      const delegate = (prisma as Record<string, any>)[config.model];
      const data = await delegate.create({ data: req.body });
      created(res, data);
    }),
  );

  router.patch(
    "/:id",
    requireAuth,
    authorizeRoles(config.permissions.update),
    validate({ body: updateSchema }),
    asyncHandler(async (req, res) => {
      const id = parseId(req.params.id, config.idType);
      const delegate = (prisma as Record<string, any>)[config.model];

      const existing = await delegate.findUnique({ where: { [config.idField]: id } });
      if (!existing) {
        throw notFound();
      }

      const data = await delegate.update({
        where: { [config.idField]: id },
        data: req.body,
      });

      ok(res, data);
    }),
  );

  router.delete(
    "/:id",
    requireAuth,
    authorizeRoles(config.permissions.delete),
    asyncHandler(async (req, res) => {
      const id = parseId(req.params.id, config.idType);
      const delegate = (prisma as Record<string, any>)[config.model];
      const existing = await delegate.findUnique({ where: { [config.idField]: id } });

      if (!existing) {
        throw notFound();
      }

      if (config.softDeleteField) {
        const data = await delegate.update({
          where: { [config.idField]: id },
          data: { [config.softDeleteField]: new Date() },
        });
        ok(res, data, "Soft deleted");
        return;
      }

      await delegate.delete({ where: { [config.idField]: id } });
      ok(res, { id }, "Deleted");
    }),
  );

  return router;
}
