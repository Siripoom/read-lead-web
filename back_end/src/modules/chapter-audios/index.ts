import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { chapterAudiosController } from "./chapter-audios.controller";
import { chapterAudiosSchemas } from "./chapter-audios.schema";

const router = Router();
const config = resourceConfigs.chapterAudios;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, chapterAudiosController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: chapterAudiosSchemas.idParamsSchema }), chapterAudiosController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: chapterAudiosSchemas.createSchema }), chapterAudiosController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: chapterAudiosSchemas.idParamsSchema, body: chapterAudiosSchemas.updateSchema }), chapterAudiosController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: chapterAudiosSchemas.idParamsSchema }), chapterAudiosController.remove);

export default router;
