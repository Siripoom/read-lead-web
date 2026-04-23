import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { payoutsController } from "./payouts.controller";
import { payoutsSchemas } from "./payouts.schema";

const router = Router();
const config = resourceConfigs.payouts;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, payoutsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: payoutsSchemas.idParamsSchema }), payoutsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: payoutsSchemas.createSchema }), payoutsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: payoutsSchemas.idParamsSchema, body: payoutsSchemas.updateSchema }), payoutsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: payoutsSchemas.idParamsSchema }), payoutsController.remove);

export default router;
