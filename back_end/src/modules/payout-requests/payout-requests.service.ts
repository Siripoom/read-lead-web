import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const payoutRequestsService = new CrudService(resourceConfigs.payoutRequests);
