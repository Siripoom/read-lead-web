import { resourceConfigs } from "../resource-config";
import { buildCrudSchemas } from "../../shared/crud/crud.schema";

export const packageItemsSchemas = buildCrudSchemas(resourceConfigs.packageItems);
