import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/libs/password";

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.$transaction([
    prisma.payout.deleteMany(),
    prisma.creatorEarning.deleteMany(),
    prisma.payoutRequest.deleteMany(),
    prisma.novelModerationLog.deleteMany(),
    prisma.userReport.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.chapterPurchase.deleteMany(),
    prisma.packagePurchase.deleteMany(),
    prisma.walletLedger.deleteMany(),
    prisma.paymentLog.deleteMany(),
    prisma.topupTransaction.deleteMany(),
    prisma.readingLibrary.deleteMany(),
    prisma.packageItem.deleteMany(),
    prisma.novelPackage.deleteMany(),
    prisma.chapterAudio.deleteMany(),
    prisma.chapter.deleteMany(),
    prisma.novel.deleteMany(),
    prisma.creatorPayoutAccount.deleteMany(),
    prisma.userSocial.deleteMany(),
    prisma.userRole.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function main() {
  await resetDatabase();

  const passwordHash = await hashPassword("password123");

  const admin = await prisma.user.create({
    data: {
      username: "admin_demo",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  const finance = await prisma.user.create({
    data: {
      username: "finance_demo",
      email: "finance@example.com",
      passwordHash,
      role: "finance",
    },
  });

  const creator = await prisma.user.create({
    data: {
      username: "creator_demo",
      email: "creator@example.com",
      passwordHash,
      role: "creator",
    },
  });

  const reader = await prisma.user.create({
    data: {
      username: "user_demo",
      email: "user@example.com",
      passwordHash,
      role: "user",
      coinBalance: 200,
    },
  });

  await prisma.userRole.createMany({
    data: [
      { userId: admin.userId, role: "admin" },
      { userId: finance.userId, role: "finance" },
      { userId: creator.userId, role: "creator" },
      { userId: reader.userId, role: "user" },
    ],
  });

  const novel = await prisma.novel.create({
    data: {
      authorId: creator.userId,
      title: "The Demo Chronicle",
      slug: "the-demo-chronicle",
      synopsis: "Seed novel for API and frontend integration.",
      status: "published",
      visibility: "public",
      publishedAt: new Date(),
      totalChapters: 2,
    },
  });

  const chapter1 = await prisma.chapter.create({
    data: {
      novelId: novel.novelId,
      chapterNo: 1,
      title: "Chapter 1 - Free Start",
      contentText: "This is a free sample chapter.",
      isFree: true,
      coinPrice: 0,
      status: "published",
      wordCount: 120,
      publishedAt: new Date(),
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      novelId: novel.novelId,
      chapterNo: 2,
      title: "Chapter 2 - Premium",
      contentText: "This is a paid chapter.",
      isFree: false,
      coinPrice: 15,
      status: "published",
      wordCount: 220,
      publishedAt: new Date(),
    },
  });

  await prisma.chapterAudio.create({
    data: {
      chapterId: chapter1.chapterId,
      fileUrl: "https://cdn.example.com/audio/chapter-1.mp3",
      durationSeconds: 181,
    },
  });

  const pkg = await prisma.novelPackage.create({
    data: {
      novelId: novel.novelId,
      packageName: "Starter Pack",
      description: "Bundle for first paid chapter",
      priceCoin: 10,
    },
  });

  await prisma.packageItem.create({
    data: {
      packageId: pkg.packageId,
      chapterId: chapter2.chapterId,
    },
  });

  await prisma.readingLibrary.create({
    data: {
      userId: reader.userId,
      novelId: novel.novelId,
      isFavorite: true,
      lastReadChapterId: chapter1.chapterId,
      lastReadAt: new Date(),
    },
  });

  const topup = await prisma.topupTransaction.create({
    data: {
      userId: reader.userId,
      amountMoney: 99,
      amountCoins: 200,
      paymentMethod: "manual",
      status: "paid",
      paidAt: new Date(),
      confirmedAt: new Date(),
    },
  });

  await prisma.walletLedger.create({
    data: {
      userId: reader.userId,
      entryType: "topup",
      direction: "credit",
      coinAmount: 200,
      balanceBefore: 0,
      balanceAfter: 200,
      refType: "topup_transaction",
      refId: topup.transactionId,
      createdBy: finance.userId,
    },
  });

  await prisma.user.update({
    where: { userId: reader.userId },
    data: { coinBalance: 185 },
  });

  const chapterPurchase = await prisma.chapterPurchase.create({
    data: {
      userId: reader.userId,
      chapterId: chapter2.chapterId,
      coinAmount: 15,
      sourceType: "single",
      status: "active",
    },
  });

  await prisma.walletLedger.create({
    data: {
      userId: reader.userId,
      entryType: "chapter_purchase",
      direction: "debit",
      coinAmount: 15,
      balanceBefore: 200,
      balanceAfter: 185,
      refType: "chapter_purchase",
      refId: chapterPurchase.purchaseId,
    },
  });

  const payoutRequest = await prisma.payoutRequest.create({
    data: {
      creatorId: creator.userId,
      requestedAmount: 10,
      requestedCoinTotal: 10,
      status: "approved",
      reviewedBy: finance.userId,
      reviewedAt: new Date(),
    },
  });

  await prisma.creatorEarning.create({
    data: {
      creatorId: creator.userId,
      novelId: novel.novelId,
      chapterId: chapter2.chapterId,
      sourceType: "chapter_purchase",
      sourcePurchaseId: chapterPurchase.purchaseId,
      grossCoin: 15,
      writerSharePercent: 70,
      creatorCoin: 10,
      platformCoin: 5,
      status: "paid_out",
      payoutRequestId: payoutRequest.payoutRequestId,
    },
  });

  await prisma.payout.create({
    data: {
      payoutRequestId: payoutRequest.payoutRequestId,
      userId: creator.userId,
      amountMoneyPaid: 10,
      feeAmount: 0,
      netAmount: 10,
      paymentMethod: "manual",
      transactionRef: "SEED-PAYOUT-001",
    },
  });

  await prisma.payoutRequest.update({
    where: { payoutRequestId: payoutRequest.payoutRequestId },
    data: {
      status: "paid",
      paidAt: new Date(),
      paymentRef: "SEED-PAYOUT-001",
    },
  });

  console.log("Seed completed.");
  console.log("Demo login users: admin@example.com, finance@example.com, creator@example.com, user@example.com");
  console.log("Password for all demo users: password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
