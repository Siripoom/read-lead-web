import { createCrudController } from "../../shared/crud/crud.controller";
import { paymentLogsService } from "./payment-logs.service";

export const paymentLogsController = createCrudController(paymentLogsService);
