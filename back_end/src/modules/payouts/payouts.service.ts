import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const payoutsService = new CrudService(resourceConfigs.payouts);
