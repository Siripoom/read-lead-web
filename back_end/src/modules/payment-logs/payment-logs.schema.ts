import { resourceConfigs } from "../resource-config";
import { buildCrudSchemas } from "../../shared/crud/crud.schema";

export const paymentLogsSchemas = buildCrudSchemas(resourceConfigs.paymentLogs);
