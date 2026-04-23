import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const topupTransactionsService = new CrudService(resourceConfigs.topupTransactions);
