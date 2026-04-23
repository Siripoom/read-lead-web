import { createCrudController } from "../../shared/crud/crud.controller";
import { payoutRequestsService } from "./payout-requests.service";

export const payoutRequestsController = createCrudController(payoutRequestsService);
