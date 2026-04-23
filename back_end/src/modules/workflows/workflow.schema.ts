import { z } from "zod";

export const markTopupPaidParamsSchema = z.object({
  id: z.string().uuid(),
});

export const purchaseChapterSchema = z.object({
  userId: z.coerce.bigint(),
  chapterId: z.coerce.bigint(),
});

export const purchasePackageSchema = z.object({
  userId: z.coerce.bigint(),
  packageId: z.coerce.bigint(),
});

export const payoutDecisionParamsSchema = z.object({
  id: z.string().uuid(),
});

export const approvePayoutRequestSchema = z.object({
  reviewedBy: z.coerce.bigint().optional(),
});

export const rejectPayoutRequestSchema = z.object({
  reviewedBy: z.coerce.bigint().optional(),
  rejectionReason: z.string().min(3).max(1000),
});

export const createPayoutSchema = z.object({
  payoutRequestId: z.string().uuid(),
  amountMoneyPaid: z.coerce.number().positive(),
  feeAmount: z.coerce.number().min(0).default(0),
  paymentMethod: z.enum(["bank_transfer", "promptpay", "manual"]).default("bank_transfer"),
  transactionRef: z.string().max(255).optional(),
  note: z.string().max(2000).optional(),
});
