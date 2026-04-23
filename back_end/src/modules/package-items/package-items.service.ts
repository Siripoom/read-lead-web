import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const packageItemsService = new CrudService(resourceConfigs.packageItems);
