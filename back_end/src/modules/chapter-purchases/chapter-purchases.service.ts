import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const chapterPurchasesService = new CrudService(resourceConfigs.chapterPurchases);
