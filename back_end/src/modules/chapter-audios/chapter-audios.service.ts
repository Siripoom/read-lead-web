import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const chapterAudiosService = new CrudService(resourceConfigs.chapterAudios);
