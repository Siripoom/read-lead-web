import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { topupTransactionsController } from "./topup-transactions.controller";
import { topupTransactionsSchemas } from "./topup-transactions.schema";

const router = Router();
const config = resourceConfigs.topupTransactions;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, topupTransactionsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: topupTransactionsSchemas.idParamsSchema }), topupTransactionsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: topupTransactionsSchemas.createSchema }), topupTransactionsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: topupTransactionsSchemas.idParamsSchema, body: topupTransactionsSchemas.updateSchema }), topupTransactionsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: topupTransactionsSchemas.idParamsSchema }), topupTransactionsController.remove);

export default router;
