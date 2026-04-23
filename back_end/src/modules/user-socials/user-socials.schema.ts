import { resourceConfigs } from "../resource-config";
import { buildCrudSchemas } from "../../shared/crud/crud.schema";

export const userSocialsSchemas = buildCrudSchemas(resourceConfigs.userSocials);
