import { createCrudController } from "../../shared/crud/crud.controller";
import { novelsService } from "./novels.service";

export const novelsController = createCrudController(novelsService);
