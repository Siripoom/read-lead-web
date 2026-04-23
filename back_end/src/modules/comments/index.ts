import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { commentsController } from "./comments.controller";
import { commentsSchemas } from "./comments.schema";

const router = Router();
const config = resourceConfigs.comments;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, commentsController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: commentsSchemas.idParamsSchema }), commentsController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: commentsSchemas.createSchema }), commentsController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: commentsSchemas.idParamsSchema, body: commentsSchemas.updateSchema }), commentsController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: commentsSchemas.idParamsSchema }), commentsController.remove);

export default router;
