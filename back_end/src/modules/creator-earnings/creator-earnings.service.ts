import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const creatorEarningsService = new CrudService(resourceConfigs.creatorEarnings);
