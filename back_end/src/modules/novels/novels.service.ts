import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const novelsService = new CrudService(resourceConfigs.novels);
