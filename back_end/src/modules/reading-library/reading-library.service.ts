import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const readingLibraryService = new CrudService(resourceConfigs.readingLibrary);
