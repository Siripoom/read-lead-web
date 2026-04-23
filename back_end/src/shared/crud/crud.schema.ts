import { z } from "zod";
import type { CrudResourceConfig } from "../../modules/resource-config";

const createSchema = z.record(z.any());
const updateSchema = z.record(z.any()).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

function buildIdSchema(idType: CrudResourceConfig["idType"]) {
  return idType === "uuid"
    ? z.object({ id: z.string().uuid() })
    : z.object({ id: z.string().regex(/^\d+$/, "id must be numeric") });
}

export function buildCrudSchemas(config: CrudResourceConfig) {
  return {
    idParamsSchema: buildIdSchema(config.idType),
    createSchema,
    updateSchema,
  };
}
