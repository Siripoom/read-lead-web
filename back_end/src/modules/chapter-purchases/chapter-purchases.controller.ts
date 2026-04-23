import { createCrudController } from "../../shared/crud/crud.controller";
import { chapterPurchasesService } from "./chapter-purchases.service";

export const chapterPurchasesController = createCrudController(chapterPurchasesService);
