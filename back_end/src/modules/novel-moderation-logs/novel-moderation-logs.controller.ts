import { createCrudController } from "../../shared/crud/crud.controller";
import { novelModerationLogsService } from "./novel-moderation-logs.service";

export const novelModerationLogsController = createCrudController(novelModerationLogsService);
