import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { walletLedgerController } from "./wallet-ledger.controller";
import { walletLedgerSchemas } from "./wallet-ledger.schema";

const router = Router();
const config = resourceConfigs.walletLedger;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, walletLedgerController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: walletLedgerSchemas.idParamsSchema }), walletLedgerController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: walletLedgerSchemas.createSchema }), walletLedgerController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: walletLedgerSchemas.idParamsSchema, body: walletLedgerSchemas.updateSchema }), walletLedgerController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: walletLedgerSchemas.idParamsSchema }), walletLedgerController.remove);

export default router;
