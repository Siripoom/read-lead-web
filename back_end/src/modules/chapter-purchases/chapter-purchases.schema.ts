import { resourceConfigs } from "../resource-config";
import { buildCrudSchemas } from "../../shared/crud/crud.schema";

export const chapterPurchasesSchemas = buildCrudSchemas(resourceConfigs.chapterPurchases);
