import { prisma } from "../../libs/prisma";
import { badRequest, notFound } from "../../shared/errors";

export async function markTopupPaid(transactionId: string, actorUserId?: bigint) {
  return prisma.$transaction(async (tx: any) => {
    const topup = await tx.topupTransaction.findUnique({
      where: { transactionId },
    });

    if (!topup) {
      throw notFound("Topup transaction not found");
    }

    if (topup.status !== "pending") {
      throw badRequest("Only pending topup can be marked as paid");
    }

    const user = await tx.user.findUnique({ where: { userId: topup.userId } });
    if (!user) {
      throw notFound("User not found");
    }

    const balanceBefore = user.coinBalance;
    const balanceAfter = balanceBefore + topup.amountCoins;

    await tx.user.update({
      where: { userId: user.userId },
      data: { coinBalance: balanceAfter },
    });

    await tx.walletLedger.create({
      data: {
        userId: user.userId,
        entryType: "topup",
        direction: "credit",
        coinAmount: topup.amountCoins,
        balanceBefore,
        balanceAfter,
        refType: "topup_transaction",
        refId: topup.transactionId,
        createdBy: actorUserId,
      },
    });

    await tx.paymentLog.create({
      data: {
        entityType: "topup",
        entityId: topup.transactionId,
        eventType: "topup.mark_paid",
        logStatus: "success",
      },
    });

    return tx.topupTransaction.update({
      where: { transactionId },
      data: {
        status: "paid",
        paidAt: new Date(),
        confirmedAt: new Date(),
      },
    });
  });
}

export async function purchaseChapter(input: { userId: bigint; chapterId: bigint }) {
  return prisma.$transaction(async (tx: any) => {
    const chapter = await tx.chapter.findFirst({
      where: {
        chapterId: input.chapterId,
        deletedAt: null,
        status: "published",
      },
      include: {
        novel: true,
      },
    });

    if (!chapter) {
      throw notFound("Chapter not found or not published");
    }

    const existingPurchase = await tx.chapterPurchase.findFirst({
      where: {
        userId: input.userId,
        chapterId: input.chapterId,
        status: "active",
      },
    });

    if (existingPurchase) {
      throw badRequest("Chapter already purchased");
    }

    const user = await tx.user.findUnique({ where: { userId: input.userId } });
    if (!user || user.deletedAt) {
      throw notFound("User not found");
    }

    let balanceBefore = user.coinBalance;
    let balanceAfter = user.coinBalance;

    if (!chapter.isFree && chapter.coinPrice > 0) {
      if (user.coinBalance < chapter.coinPrice) {
        throw badRequest("Insufficient coin balance");
      }

      balanceAfter = balanceBefore - chapter.coinPrice;

      await tx.user.update({
        where: { userId: user.userId },
        data: { coinBalance: balanceAfter },
      });

      await tx.walletLedger.create({
        data: {
          userId: user.userId,
          entryType: "chapter_purchase",
          direction: "debit",
          coinAmount: chapter.coinPrice,
          balanceBefore,
          balanceAfter,
          refType: "chapter_purchase",
          refId: "pending",
        },
      });
    }

    const purchase = await tx.chapterPurchase.create({
      data: {
        userId: user.userId,
        chapterId: chapter.chapterId,
        coinAmount: chapter.coinPrice,
        sourceType: "single",
      },
    });

    if (!chapter.isFree && chapter.coinPrice > 0) {
      await tx.walletLedger.updateMany({
        where: {
          userId: user.userId,
          refType: "chapter_purchase",
          refId: "pending",
        },
        data: {
          refId: purchase.purchaseId,
        },
      });

      const writerSharePercent = Number(chapter.novel.writerSharePercent);
      const creatorCoin = Math.floor((chapter.coinPrice * writerSharePercent) / 100);
      const platformCoin = chapter.coinPrice - creatorCoin;

      await tx.creatorEarning.create({
        data: {
          creatorId: chapter.novel.authorId,
          novelId: chapter.novelId,
          chapterId: chapter.chapterId,
          sourceType: "chapter_purchase",
          sourcePurchaseId: purchase.purchaseId,
          grossCoin: chapter.coinPrice,
          writerSharePercent,
          creatorCoin,
          platformCoin,
          status: "available",
        },
      });
    }

    return {
      purchase,
      balanceAfter,
    };
  });
}

export async function purchasePackage(input: { userId: bigint; packageId: bigint }) {
  return prisma.$transaction(async (tx: any) => {
    const pkg = await tx.novelPackage.findFirst({
      where: {
        packageId: input.packageId,
        status: "active",
      },
      include: {
        packageItems: true,
        novel: true,
      },
    });

    if (!pkg) {
      throw notFound("Package not found or inactive");
    }

    const user = await tx.user.findUnique({ where: { userId: input.userId } });
    if (!user || user.deletedAt) {
      throw notFound("User not found");
    }

    if (user.coinBalance < pkg.priceCoin) {
      throw badRequest("Insufficient coin balance");
    }

    const balanceBefore = user.coinBalance;
    const balanceAfter = balanceBefore - pkg.priceCoin;

    await tx.user.update({
      where: { userId: user.userId },
      data: { coinBalance: balanceAfter },
    });

    const packagePurchase = await tx.packagePurchase.create({
      data: {
        userId: user.userId,
        packageId: pkg.packageId,
        coinPaid: pkg.priceCoin,
      },
    });

    await tx.walletLedger.create({
      data: {
        userId: user.userId,
        entryType: "package_purchase",
        direction: "debit",
        coinAmount: pkg.priceCoin,
        balanceBefore,
        balanceAfter,
        refType: "package_purchase",
        refId: packagePurchase.pkgTransId,
      },
    });

    const chapterPurchases = await Promise.all(
      pkg.packageItems.map((item: any) =>
        tx.chapterPurchase.create({
          data: {
            userId: user.userId,
            chapterId: item.chapterId,
            coinAmount: 0,
            sourceType: "package",
            refPkgTransId: packagePurchase.pkgTransId,
          },
        }),
      ),
    );

    const writerSharePercent = Number(pkg.novel.writerSharePercent);
    const creatorCoin = Math.floor((pkg.priceCoin * writerSharePercent) / 100);
    const platformCoin = pkg.priceCoin - creatorCoin;

    await tx.creatorEarning.create({
      data: {
        creatorId: pkg.novel.authorId,
        novelId: pkg.novelId,
        sourceType: "package_purchase",
        sourcePurchaseId: packagePurchase.pkgTransId,
        grossCoin: pkg.priceCoin,
        writerSharePercent,
        creatorCoin,
        platformCoin,
        status: "available",
      },
    });

    return {
      packagePurchase,
      chapterPurchases,
      balanceAfter,
    };
  });
}

export async function approvePayoutRequest(id: string, reviewedBy?: bigint) {
  return prisma.$transaction(async (tx: any) => {
    const request = await tx.payoutRequest.findUnique({ where: { payoutRequestId: id } });
    if (!request) {
      throw notFound("Payout request not found");
    }

    if (request.status !== "pending") {
      throw badRequest("Only pending payout requests can be approved");
    }

    const updated = await tx.payoutRequest.update({
      where: { payoutRequestId: id },
      data: {
        status: "approved",
        reviewedBy,
        reviewedAt: new Date(),
      },
    });

    await tx.creatorEarning.updateMany({
      where: {
        creatorId: request.creatorId,
        status: "available",
        payoutRequestId: null,
      },
      data: {
        status: "reserved_for_payout",
        payoutRequestId: updated.payoutRequestId,
      },
    });

    return updated;
  });
}

export async function rejectPayoutRequest(id: string, reviewedBy: bigint | undefined, rejectionReason: string) {
  return prisma.payoutRequest.update({
    where: { payoutRequestId: id },
    data: {
      status: "rejected",
      reviewedBy,
      reviewedAt: new Date(),
      rejectionReason,
    },
  });
}

export async function createPayout(input: {
  payoutRequestId: string;
  amountMoneyPaid: number;
  feeAmount: number;
  paymentMethod: "bank_transfer" | "promptpay" | "manual";
  transactionRef?: string;
  note?: string;
}) {
  return prisma.$transaction(async (tx: any) => {
    const request = await tx.payoutRequest.findUnique({ where: { payoutRequestId: input.payoutRequestId } });

    if (!request) {
      throw notFound("Payout request not found");
    }

    if (request.status !== "approved") {
      throw badRequest("Payout request must be approved before payout");
    }

    const netAmount = input.amountMoneyPaid - input.feeAmount;
    if (netAmount < 0) {
      throw badRequest("netAmount must be non-negative");
    }

    const payout = await tx.payout.create({
      data: {
        payoutRequestId: request.payoutRequestId,
        userId: request.creatorId,
        amountMoneyPaid: input.amountMoneyPaid,
        feeAmount: input.feeAmount,
        netAmount,
        paymentMethod: input.paymentMethod,
        transactionRef: input.transactionRef,
        note: input.note,
      },
    });

    await tx.payoutRequest.update({
      where: { payoutRequestId: request.payoutRequestId },
      data: {
        status: "paid",
        paidAt: new Date(),
        paymentRef: payout.transactionRef,
      },
    });

    await tx.creatorEarning.updateMany({
      where: {
        payoutRequestId: request.payoutRequestId,
        status: {
          in: ["reserved_for_payout", "available"],
        },
      },
      data: {
        status: "paid_out",
      },
    });

    await tx.paymentLog.create({
      data: {
        entityType: "payout",
        entityId: payout.payoutId,
        eventType: "payout.created",
        logStatus: "success",
      },
    });

    return payout;
  });
}
