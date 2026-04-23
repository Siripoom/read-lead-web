import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { novelModerationLogsController } from "./novel-moderation-logs.controller";
import { novelModerationLogsSchemas } from "./novel-moderation-logs.schema";

const router = Router();
const config = resourceConfigs.novelModerationLogs;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, novelModerationLogsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: novelModerationLogsSchemas.idParamsSchema }), novelModerationLogsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: novelModerationLogsSchemas.createSchema }), novelModerationLogsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: novelModerationLogsSchemas.idParamsSchema, body: novelModerationLogsSchemas.updateSchema }), novelModerationLogsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: novelModerationLogsSchemas.idParamsSchema }), novelModerationLogsController.remove);

export default router;
