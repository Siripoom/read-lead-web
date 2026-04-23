import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { userSocialsController } from "./user-socials.controller";
import { userSocialsSchemas } from "./user-socials.schema";

const router = Router();
const config = resourceConfigs.userSocials;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, userSocialsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: userSocialsSchemas.idParamsSchema }), userSocialsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: userSocialsSchemas.createSchema }), userSocialsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: userSocialsSchemas.idParamsSchema, body: userSocialsSchemas.updateSchema }), userSocialsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: userSocialsSchemas.idParamsSchema }), userSocialsController.remove);

export default router;
