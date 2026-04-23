import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { packageItemsController } from "./package-items.controller";
import { packageItemsSchemas } from "./package-items.schema";

const router = Router();
const config = resourceConfigs.packageItems;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, packageItemsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: packageItemsSchemas.idParamsSchema }), packageItemsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: packageItemsSchemas.createSchema }), packageItemsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: packageItemsSchemas.idParamsSchema, body: packageItemsSchemas.updateSchema }), packageItemsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: packageItemsSchemas.idParamsSchema }), packageItemsController.remove);

export default router;
