import { PrismaClient } from "@prisma/client";

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function cleanDatabase() {
  await testPrisma.$transaction([
    testPrisma.payout.deleteMany(),
    testPrisma.creatorEarning.deleteMany(),
    testPrisma.payoutRequest.deleteMany(),
    testPrisma.novelModerationLog.deleteMany(),
    testPrisma.userReport.deleteMany(),
    testPrisma.notification.deleteMany(),
    testPrisma.comment.deleteMany(),
    testPrisma.chapterPurchase.deleteMany(),
    testPrisma.packagePurchase.deleteMany(),
    testPrisma.walletLedger.deleteMany(),
    testPrisma.paymentLog.deleteMany(),
    testPrisma.topupTransaction.deleteMany(),
    testPrisma.readingLibrary.deleteMany(),
    testPrisma.packageItem.deleteMany(),
    testPrisma.novelPackage.deleteMany(),
    testPrisma.chapterAudio.deleteMany(),
    testPrisma.chapter.deleteMany(),
    testPrisma.novel.deleteMany(),
    testPrisma.creatorPayoutAccount.deleteMany(),
    testPrisma.userSocial.deleteMany(),
    testPrisma.userRole.deleteMany(),
    testPrisma.user.deleteMany(),
  ]);
}
