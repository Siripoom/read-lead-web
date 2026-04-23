import { createCrudController } from "../../shared/crud/crud.controller";
import { chapterAudiosService } from "./chapter-audios.service";

export const chapterAudiosController = createCrudController(chapterAudiosService);
