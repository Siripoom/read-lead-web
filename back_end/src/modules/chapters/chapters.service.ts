import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const chaptersService = new CrudService(resourceConfigs.chapters);
