import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { usersController } from "./users.controller";
import { usersSchemas } from "./users.schema";

const router = Router();
const config = resourceConfigs.users;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, usersController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: usersSchemas.idParamsSchema }), usersController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: usersSchemas.createSchema }), usersController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: usersSchemas.idParamsSchema, body: usersSchemas.updateSchema }), usersController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: usersSchemas.idParamsSchema }), usersController.remove);

export default router;
