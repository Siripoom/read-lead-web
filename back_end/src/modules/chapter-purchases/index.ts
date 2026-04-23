import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { pagination } from "../../middlewares/pagination.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { resourceConfigs } from "../resource-config";
import { chapterPurchasesController } from "./chapter-purchases.controller";
import { chapterPurchasesSchemas } from "./chapter-purchases.schema";

const router = Router();
const config = resourceConfigs.chapterPurchases;

router.get("/", requireAuth, authorizeRoles(config.permissions.list), pagination, chapterPurchasesController.list);
router.get("/:id", requireAuth, authorizeRoles(config.permissions.get), validate({ params: chapterPurchasesSchemas.idParamsSchema }), chapterPurchasesController.getById);
router.post("/", requireAuth, authorizeRoles(config.permissions.create), validate({ body: chapterPurchasesSchemas.createSchema }), chapterPurchasesController.create);
router.patch("/:id", requireAuth, authorizeRoles(config.permissions.update), validate({ params: chapterPurchasesSchemas.idParamsSchema, body: chapterPurchasesSchemas.updateSchema }), chapterPurchasesController.update);
router.delete("/:id", requireAuth, authorizeRoles(config.permissions.delete), validate({ params: chapterPurchasesSchemas.idParamsSchema }), chapterPurchasesController.remove);

export default router;
