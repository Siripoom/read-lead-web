import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { creatorEarningsController } from "./creator-earnings.controller";
import { creatorEarningsSchemas } from "./creator-earnings.schema";

const router = Router();
const config = resourceConfigs.creatorEarnings;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, creatorEarningsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: creatorEarningsSchemas.idParamsSchema }), creatorEarningsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: creatorEarningsSchemas.createSchema }), creatorEarningsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: creatorEarningsSchemas.idParamsSchema, body: creatorEarningsSchemas.updateSchema }), creatorEarningsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: creatorEarningsSchemas.idParamsSchema }), creatorEarningsController.remove);

export default router;
