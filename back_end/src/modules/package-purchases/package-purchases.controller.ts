import { createCrudController } from "../../shared/crud/crud.controller";
import { packagePurchasesService } from "./package-purchases.service";

export const packagePurchasesController = createCrudController(packagePurchasesService);
