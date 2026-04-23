import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { userReportsController } from "./user-reports.controller";
import { userReportsSchemas } from "./user-reports.schema";

const router = Router();
const config = resourceConfigs.userReports;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, userReportsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: userReportsSchemas.idParamsSchema }), userReportsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: userReportsSchemas.createSchema }), userReportsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: userReportsSchemas.idParamsSchema, body: userReportsSchemas.updateSchema }), userReportsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: userReportsSchemas.idParamsSchema }), userReportsController.remove);

export default router;
