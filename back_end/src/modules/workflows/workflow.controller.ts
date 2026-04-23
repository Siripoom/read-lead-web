import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { created, ok } from "../../shared/utils/api-response";
import * as workflowService from "./workflow.service";

export const markTopupPaid = asyncHandler(async (req: Request, res: Response) => {
  const actorUserId = req.user ? BigInt(req.user.userId) : undefined;
  const result = await workflowService.markTopupPaid(req.params.id, actorUserId);
  ok(res, result, "Topup marked as paid");
});

export const purchaseChapter = asyncHandler(async (req: Request, res: Response) => {
  const result = await workflowService.purchaseChapter(req.body);
  created(res, result, "Chapter purchased");
});

export const purchasePackage = asyncHandler(async (req: Request, res: Response) => {
  const result = await workflowService.purchasePackage(req.body);
  created(res, result, "Package purchased");
});

export const approvePayoutRequest = asyncHandler(async (req: Request, res: Response) => {
  const reviewedBy = req.body.reviewedBy ?? (req.user ? BigInt(req.user.userId) : undefined);
  const result = await workflowService.approvePayoutRequest(req.params.id, reviewedBy);
  ok(res, result, "Payout request approved");
});

export const rejectPayoutRequest = asyncHandler(async (req: Request, res: Response) => {
  const reviewedBy = req.body.reviewedBy ?? (req.user ? BigInt(req.user.userId) : undefined);
  const result = await workflowService.rejectPayoutRequest(req.params.id, reviewedBy, req.body.rejectionReason);
  ok(res, result, "Payout request rejected");
});

export const createPayout = asyncHandler(async (req: Request, res: Response) => {
  const result = await workflowService.createPayout(req.body);
  created(res, result, "Payout created");
});
