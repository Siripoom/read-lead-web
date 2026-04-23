import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const commentsService = new CrudService(resourceConfigs.comments);
