import { createCrudController } from "../../shared/crud/crud.controller";
import { readingLibraryService } from "./reading-library.service";

export const readingLibraryController = createCrudController(readingLibraryService);
