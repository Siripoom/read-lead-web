import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { packagePurchasesController } from "./package-purchases.controller";
import { packagePurchasesSchemas } from "./package-purchases.schema";

const router = Router();
const config = resourceConfigs.packagePurchases;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, packagePurchasesController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: packagePurchasesSchemas.idParamsSchema }), packagePurchasesController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: packagePurchasesSchemas.createSchema }), packagePurchasesController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: packagePurchasesSchemas.idParamsSchema, body: packagePurchasesSchemas.updateSchema }), packagePurchasesController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: packagePurchasesSchemas.idParamsSchema }), packagePurchasesController.remove);

export default router;
