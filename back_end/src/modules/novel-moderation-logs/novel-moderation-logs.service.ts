import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const novelModerationLogsService = new CrudService(resourceConfigs.novelModerationLogs);
