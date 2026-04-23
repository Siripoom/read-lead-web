import { createCrudController } from "../../shared/crud/crud.controller";
import { novelPackagesService } from "./novel-packages.service";

export const novelPackagesController = createCrudController(novelPackagesService);
