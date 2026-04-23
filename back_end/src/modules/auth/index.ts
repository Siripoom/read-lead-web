import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import * as authController from "./auth.controller";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schema";

const router = Router();

router.post("/register", validate({ body: registerSchema }), authController.register);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.post("/refresh", validate({ body: refreshSchema }), authController.refresh);
router.post("/logout", validate({ body: refreshSchema }), authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
