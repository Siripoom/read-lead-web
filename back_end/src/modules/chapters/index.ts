import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { chaptersController } from "./chapters.controller";
import { chaptersSchemas } from "./chapters.schema";

const router = Router();
const config = resourceConfigs.chapters;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, chaptersController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: chaptersSchemas.idParamsSchema }), chaptersController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: chaptersSchemas.createSchema }), chaptersController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: chaptersSchemas.idParamsSchema, body: chaptersSchemas.updateSchema }), chaptersController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: chaptersSchemas.idParamsSchema }), chaptersController.remove);

export default router;
