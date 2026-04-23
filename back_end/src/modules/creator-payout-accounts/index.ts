import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { creatorPayoutAccountsController } from "./creator-payout-accounts.controller";
import { creatorPayoutAccountsSchemas } from "./creator-payout-accounts.schema";

const router = Router();
const config = resourceConfigs.creatorPayoutAccounts;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, creatorPayoutAccountsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: creatorPayoutAccountsSchemas.idParamsSchema }), creatorPayoutAccountsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: creatorPayoutAccountsSchemas.createSchema }), creatorPayoutAccountsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: creatorPayoutAccountsSchemas.idParamsSchema, body: creatorPayoutAccountsSchemas.updateSchema }), creatorPayoutAccountsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: creatorPayoutAccountsSchemas.idParamsSchema }), creatorPayoutAccountsController.remove);

export default router;
