import { createCrudController } from "../../shared/crud/crud.controller";
import { chaptersService } from "./chapters.service";

export const chaptersController = createCrudController(chaptersService);
