import { prisma } from "../../libs/prisma";
import { issueTokenPair, revokeRefreshToken, verifyRefreshToken } from "../../libs/jwt";
import { hashPassword, verifyPassword } from "../../libs/password";
import { badRequest, notFound, unauthorized } from "../../shared/errors";

function toSafeUser(user: {
  userId: bigint;
  username: string;
  email: string;
  role: string;
  coinBalance: number;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    userId: user.userId.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    coinBalance: user.coinBalance,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function register(input: { username: string; email: string; password: string }) {
  const existing = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      OR: [{ email: input.email }, { username: input.username }],
    },
  });

  if (existing) {
    throw badRequest("Email or username already in use");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      role: "user",
      userRoles: {
        create: {
          role: "user",
        },
      },
    },
    select: {
      userId: true,
      username: true,
      email: true,
      role: true,
      coinBalance: true,
      isActive: true,
      createdAt: true,
    },
  });

  const tokens = issueTokenPair(user.userId.toString(), user.role as any);

  return {
    user: toSafeUser(user),
    tokens,
  };
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
      deletedAt: null,
    },
  });

  if (!user || !user.passwordHash) {
    throw unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw unauthorized("User is inactive");
  }

  const validPassword = await verifyPassword(input.password, user.passwordHash);
  if (!validPassword) {
    throw unauthorized("Invalid email or password");
  }

  const tokens = issueTokenPair(user.userId.toString(), user.role as any);

  return {
    user: toSafeUser(user),
    tokens,
  };
}

export async function refresh(refreshToken: string) {
  const claims = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({ where: { userId: BigInt(claims.sub) } });
  if (!user || user.deletedAt || !user.isActive) {
    throw unauthorized("User not available");
  }

  revokeRefreshToken(claims.jti);

  const tokens = issueTokenPair(user.userId.toString(), user.role as any);
  return {
    user: toSafeUser(user),
    tokens,
  };
}

export async function logout(refreshToken: string) {
  const claims = verifyRefreshToken(refreshToken);
  revokeRefreshToken(claims.jti);
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({
    where: { userId: BigInt(userId) },
    select: {
      userId: true,
      username: true,
      email: true,
      role: true,
      coinBalance: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user || user.userId === undefined) {
    throw notFound("User not found");
  }

  return toSafeUser(user);
}
