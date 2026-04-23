import { createCrudController } from "../../shared/crud/crud.controller";
import { packageItemsService } from "./package-items.service";

export const packageItemsController = createCrudController(packageItemsService);
