import { createCrudController } from "../../shared/crud/crud.controller";
import { creatorPayoutAccountsService } from "./creator-payout-accounts.service";

export const creatorPayoutAccountsController = createCrudController(creatorPayoutAccountsService);
