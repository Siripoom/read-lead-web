import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const notificationsService = new CrudService(resourceConfigs.notifications);
