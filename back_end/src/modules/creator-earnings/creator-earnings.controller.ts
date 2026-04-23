import { createCrudController } from "../../shared/crud/crud.controller";
import { creatorEarningsService } from "./creator-earnings.service";

export const creatorEarningsController = createCrudController(creatorEarningsService);
