import { createCrudController } from "../../shared/crud/crud.controller";
import { payoutsService } from "./payouts.service";

export const payoutsController = createCrudController(payoutsService);
