import type { Role } from "../shared/constants/roles";

export type CrudAction = "list" | "get" | "create" | "update" | "delete";

type IdType = "bigint" | "uuid";

export interface CrudResourceConfig {
  name: string;
  model: string;
  idField: string;
  idType: IdType;
  softDeleteField?: string;
  searchFields?: string[];
  defaultSortBy?: string;
  permissions: Record<CrudAction, Role[]>;
}

const allRoles: Role[] = ["user", "creator", "admin", "finance"];
const adminOnly: Role[] = ["admin"];
const adminFinance: Role[] = ["admin", "finance"];
const creatorAdmin: Role[] = ["creator", "admin"];

function permissionMatrix(overrides: Partial<Record<CrudAction, Role[]>>): Record<CrudAction, Role[]> {
  return {
    list: overrides.list ?? allRoles,
    get: overrides.get ?? allRoles,
    create: overrides.create ?? adminOnly,
    update: overrides.update ?? adminOnly,
    delete: overrides.delete ?? adminOnly,
  };
}

export const resourceConfigs: Record<string, CrudResourceConfig> = {
  users: {
    name: "users",
    model: "user",
    idField: "userId",
    idType: "bigint",
    softDeleteField: "deletedAt",
    searchFields: ["username", "email"],
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: adminOnly, get: adminOnly }),
  },
  userRoles: {
    name: "user-roles",
    model: "userRole",
    idField: "id",
    idType: "bigint",
    defaultSortBy: "id",
    permissions: permissionMatrix({ list: adminOnly, get: adminOnly }),
  },
  userSocials: {
    name: "user-socials",
    model: "userSocial",
    idField: "socialId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: adminOnly, get: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly }),
  },
  novels: {
    name: "novels",
    model: "novel",
    idField: "novelId",
    idType: "bigint",
    softDeleteField: "deletedAt",
    searchFields: ["title", "slug"],
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: creatorAdmin, update: creatorAdmin, delete: creatorAdmin }),
  },
  chapters: {
    name: "chapters",
    model: "chapter",
    idField: "chapterId",
    idType: "bigint",
    softDeleteField: "deletedAt",
    searchFields: ["title"],
    defaultSortBy: "chapterNo",
    permissions: permissionMatrix({ create: creatorAdmin, update: creatorAdmin, delete: creatorAdmin }),
  },
  chapterAudios: {
    name: "chapter-audios",
    model: "chapterAudio",
    idField: "audioId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: creatorAdmin, update: creatorAdmin, delete: creatorAdmin }),
  },
  novelPackages: {
    name: "novel-packages",
    model: "novelPackage",
    idField: "packageId",
    idType: "bigint",
    searchFields: ["packageName"],
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: creatorAdmin, update: creatorAdmin, delete: creatorAdmin }),
  },
  packageItems: {
    name: "package-items",
    model: "packageItem",
    idField: "id",
    idType: "bigint",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: creatorAdmin, update: creatorAdmin, delete: creatorAdmin }),
  },
  readingLibrary: {
    name: "reading-library",
    model: "readingLibrary",
    idField: "id",
    idType: "bigint",
    defaultSortBy: "updatedAt",
    permissions: permissionMatrix({ create: ["user", "creator", "admin"], update: ["user", "creator", "admin"], delete: ["user", "creator", "admin"] }),
  },
  topupTransactions: {
    name: "topup-transactions",
    model: "topupTransaction",
    idField: "transactionId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: ["user", "admin", "finance"], update: adminFinance, delete: adminFinance }),
  },
  paymentLogs: {
    name: "payment-logs",
    model: "paymentLog",
    idField: "logId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: adminFinance, get: adminFinance, create: adminFinance, update: adminFinance, delete: ["admin"] }),
  },
  walletLedger: {
    name: "wallet-ledger",
    model: "walletLedger",
    idField: "ledgerId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: adminFinance, get: adminFinance, create: adminFinance, update: adminFinance, delete: ["admin"] }),
  },
  packagePurchases: {
    name: "package-purchases",
    model: "packagePurchase",
    idField: "pkgTransId",
    idType: "uuid",
    defaultSortBy: "purchasedAt",
    permissions: permissionMatrix({ create: ["user", "admin", "finance"], update: adminFinance, delete: ["admin"] }),
  },
  chapterPurchases: {
    name: "chapter-purchases",
    model: "chapterPurchase",
    idField: "purchaseId",
    idType: "uuid",
    defaultSortBy: "purchasedAt",
    permissions: permissionMatrix({ create: ["user", "admin", "finance"], update: adminFinance, delete: ["admin"] }),
  },
  creatorEarnings: {
    name: "creator-earnings",
    model: "creatorEarning",
    idField: "earningId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: adminFinance, get: adminFinance, create: adminFinance, update: adminFinance, delete: ["admin"] }),
  },
  payoutRequests: {
    name: "payout-requests",
    model: "payoutRequest",
    idField: "payoutRequestId",
    idType: "uuid",
    defaultSortBy: "requestedAt",
    permissions: permissionMatrix({ create: ["creator", "admin"], update: adminFinance, delete: ["admin"] }),
  },
  payouts: {
    name: "payouts",
    model: "payout",
    idField: "payoutId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: adminFinance, get: adminFinance, create: adminFinance, update: adminFinance, delete: ["admin"] }),
  },
  novelModerationLogs: {
    name: "novel-moderation-logs",
    model: "novelModerationLog",
    idField: "reviewId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ list: creatorAdmin, get: creatorAdmin, create: adminOnly, update: adminOnly, delete: adminOnly }),
  },
  comments: {
    name: "comments",
    model: "comment",
    idField: "commentId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: ["user", "creator", "admin"], update: ["user", "creator", "admin"], delete: ["user", "creator", "admin"] }),
  },
  notifications: {
    name: "notifications",
    model: "notification",
    idField: "notificationId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: adminFinance, update: adminFinance, delete: ["admin"] }),
  },
  userReports: {
    name: "user-reports",
    model: "userReport",
    idField: "reportId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: ["user", "creator", "admin"], update: adminOnly, delete: adminOnly }),
  },
  creatorPayoutAccounts: {
    name: "creator-payout-accounts",
    model: "creatorPayoutAccount",
    idField: "payoutAccountId",
    idType: "uuid",
    defaultSortBy: "createdAt",
    permissions: permissionMatrix({ create: ["creator", "admin"], update: ["creator", "admin"], delete: ["creator", "admin"] }),
  },
};
