import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const paymentLogsService = new CrudService(resourceConfigs.paymentLogs);
