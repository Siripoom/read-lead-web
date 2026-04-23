import { createCrudController } from "../../shared/crud/crud.controller";
import { commentsService } from "./comments.service";

export const commentsController = createCrudController(commentsService);
