import { resourceConfigs } from "../resource-config";
import { buildCrudSchemas } from "../../shared/crud/crud.schema";

export const commentsSchemas = buildCrudSchemas(resourceConfigs.comments);
