import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { userRolesController } from "./user-roles.controller";
import { userRolesSchemas } from "./user-roles.schema";

const router = Router();
const config = resourceConfigs.userRoles;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, userRolesController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: userRolesSchemas.idParamsSchema }), userRolesController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: userRolesSchemas.createSchema }), userRolesController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: userRolesSchemas.idParamsSchema, body: userRolesSchemas.updateSchema }), userRolesController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: userRolesSchemas.idParamsSchema }), userRolesController.remove);

export default router;
