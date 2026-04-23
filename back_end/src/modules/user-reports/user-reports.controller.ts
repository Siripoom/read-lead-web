import { createCrudController } from "../../shared/crud/crud.controller";
import { userReportsService } from "./user-reports.service";

export const userReportsController = createCrudController(userReportsService);
