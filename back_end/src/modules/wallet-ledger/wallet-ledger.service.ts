import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const walletLedgerService = new CrudService(resourceConfigs.walletLedger);
