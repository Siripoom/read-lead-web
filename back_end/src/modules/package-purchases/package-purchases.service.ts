import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const packagePurchasesService = new CrudService(resourceConfigs.packagePurchases);
