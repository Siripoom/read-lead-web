import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import * as workflowController from "./workflow.controller";
import {
  approvePayoutRequestSchema,
  createPayoutSchema,
  markTopupPaidParamsSchema,
  payoutDecisionParamsSchema,
  purchaseChapterSchema,
  purchasePackageSchema,
  rejectPayoutRequestSchema,
} from "./workflow.schema";

const router = Router();

router.post(
  "/topups/:id/mark-paid",
  requireAuth,
  authorizeRoles(["admin", "finance"]),
  validate({ params: markTopupPaidParamsSchema }),
  workflowController.markTopupPaid,
);

router.post(
  "/purchases/chapters",
  requireAuth,
  authorizeRoles(["user", "creator", "admin"]),
  validate({ body: purchaseChapterSchema }),
  workflowController.purchaseChapter,
);

router.post(
  "/purchases/packages",
  requireAuth,
  authorizeRoles(["user", "creator", "admin"]),
  validate({ body: purchasePackageSchema }),
  workflowController.purchasePackage,
);

router.post(
  "/payout-requests/:id/approve",
  requireAuth,
  authorizeRoles(["admin", "finance"]),
  validate({ params: payoutDecisionParamsSchema, body: approvePayoutRequestSchema }),
  workflowController.approvePayoutRequest,
);

router.post(
  "/payout-requests/:id/reject",
  requireAuth,
  authorizeRoles(["admin", "finance"]),
  validate({ params: payoutDecisionParamsSchema, body: rejectPayoutRequestSchema }),
  workflowController.rejectPayoutRequest,
);

router.post(
  "/payouts",
  requireAuth,
  authorizeRoles(["admin", "finance"]),
  validate({ body: createPayoutSchema }),
  workflowController.createPayout,
);

export default router;
