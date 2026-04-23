import { resourceConfigs } from "../resource-config";
import { buildCrudSchemas } from "../../shared/crud/crud.schema";

export const readingLibrarySchemas = buildCrudSchemas(resourceConfigs.readingLibrary);
