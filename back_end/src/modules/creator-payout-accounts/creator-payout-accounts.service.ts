import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const creatorPayoutAccountsService = new CrudService(resourceConfigs.creatorPayoutAccounts);
