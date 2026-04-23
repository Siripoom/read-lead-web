import { createCrudController } from "../../shared/crud/crud.controller";
import { notificationsService } from "./notifications.service";

export const notificationsController = createCrudController(notificationsService);
