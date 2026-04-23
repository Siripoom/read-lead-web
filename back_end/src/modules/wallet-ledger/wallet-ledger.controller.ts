import { createCrudController } from "../../shared/crud/crud.controller";
import { walletLedgerService } from "./wallet-ledger.service";

export const walletLedgerController = createCrudController(walletLedgerService);
