import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { payoutRequestsController } from "./payout-requests.controller";
import { payoutRequestsSchemas } from "./payout-requests.schema";

const router = Router();
const config = resourceConfigs.payoutRequests;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, payoutRequestsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: payoutRequestsSchemas.idParamsSchema }), payoutRequestsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: payoutRequestsSchemas.createSchema }), payoutRequestsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: payoutRequestsSchemas.idParamsSchema, body: payoutRequestsSchemas.updateSchema }), payoutRequestsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: payoutRequestsSchemas.idParamsSchema }), payoutRequestsController.remove);

export default router;
