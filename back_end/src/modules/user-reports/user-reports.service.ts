import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const userReportsService = new CrudService(resourceConfigs.userReports);
