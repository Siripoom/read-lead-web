import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { readingLibraryController } from "./reading-library.controller";
import { readingLibrarySchemas } from "./reading-library.schema";

const router = Router();
const config = resourceConfigs.readingLibrary;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, readingLibraryController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: readingLibrarySchemas.idParamsSchema }), readingLibraryController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: readingLibrarySchemas.createSchema }), readingLibraryController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: readingLibrarySchemas.idParamsSchema, body: readingLibrarySchemas.updateSchema }), readingLibraryController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: readingLibrarySchemas.idParamsSchema }), readingLibraryController.remove);

export default router;
