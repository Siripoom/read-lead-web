import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { novelPackagesController } from "./novel-packages.controller";
import { novelPackagesSchemas } from "./novel-packages.schema";

const router = Router();
const config = resourceConfigs.novelPackages;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, novelPackagesController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: novelPackagesSchemas.idParamsSchema }), novelPackagesController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: novelPackagesSchemas.createSchema }), novelPackagesController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: novelPackagesSchemas.idParamsSchema, body: novelPackagesSchemas.updateSchema }), novelPackagesController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: novelPackagesSchemas.idParamsSchema }), novelPackagesController.remove);

export default router;
