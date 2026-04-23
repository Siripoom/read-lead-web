import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { paymentLogsController } from "./payment-logs.controller";
import { paymentLogsSchemas } from "./payment-logs.schema";

const router = Router();
const config = resourceConfigs.paymentLogs;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, paymentLogsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: paymentLogsSchemas.idParamsSchema }), paymentLogsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: paymentLogsSchemas.createSchema }), paymentLogsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: paymentLogsSchemas.idParamsSchema, body: paymentLogsSchemas.updateSchema }), paymentLogsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: paymentLogsSchemas.idParamsSchema }), paymentLogsController.remove);

export default router;
