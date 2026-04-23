import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { notificationsController } from "./notifications.controller";
import { notificationsSchemas } from "./notifications.schema";

const router = Router();
const config = resourceConfigs.notifications;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, notificationsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: notificationsSchemas.idParamsSchema }), notificationsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: notificationsSchemas.createSchema }), notificationsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: notificationsSchemas.idParamsSchema, body: notificationsSchemas.updateSchema }), notificationsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: notificationsSchemas.idParamsSchema }), notificationsController.remove);

export default router;
