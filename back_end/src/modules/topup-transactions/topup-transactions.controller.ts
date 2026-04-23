import { createCrudController } from "../../shared/crud/crud.controller";
import { topupTransactionsService } from "./topup-transactions.service";

export const topupTransactionsController = createCrudController(topupTransactionsService);
