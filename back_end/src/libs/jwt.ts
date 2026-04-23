import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import type { Role } from "../shared/constants/roles";
import { unauthorized } from "../shared/errors";

export interface AuthClaims {
  sub: string;
  role: Role;
  tokenType: "access" | "refresh";
  jti?: string;
}

interface SignedTokens {
  accessToken: string;
  refreshToken: string;
}

const revokedRefreshTokens = new Map<string, number>();

function signToken(payload: AuthClaims, secret: string, expiresIn: string): string {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
    subject: payload.sub,
  };
  if (payload.jti) {
    options.jwtid = payload.jti;
  }

  return jwt.sign({ role: payload.role, tokenType: payload.tokenType }, secret, options);
}

export function issueTokenPair(sub: string, role: Role): SignedTokens {
  const refreshJti = randomUUID();

  const accessToken = signToken(
    {
      sub,
      role,
      tokenType: "access",
    },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );

  const refreshToken = signToken(
    {
      sub,
      role,
      tokenType: "refresh",
      jti: refreshJti,
    },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  return { accessToken, refreshToken };
}

function verify(token: string, secret: string): AuthClaims {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const sub = decoded.sub;
    const role = decoded.role;
    const tokenType = decoded.tokenType;

    if (typeof sub !== "string" || typeof role !== "string" || (tokenType !== "access" && tokenType !== "refresh")) {
      throw unauthorized("Invalid token claims");
    }

    return {
      sub,
      role: role as Role,
      tokenType,
      jti: decoded.jti,
    };
  } catch {
    throw unauthorized("Invalid or expired token");
  }
}

export function verifyAccessToken(token: string): AuthClaims {
  const claims = verify(token, env.JWT_ACCESS_SECRET);
  if (claims.tokenType !== "access") {
    throw unauthorized("Invalid access token");
  }
  return claims;
}

export function verifyRefreshToken(token: string): AuthClaims {
  const claims = verify(token, env.JWT_REFRESH_SECRET);
  if (claims.tokenType !== "refresh") {
    throw unauthorized("Invalid refresh token");
  }
  if (claims.jti && revokedRefreshTokens.has(claims.jti)) {
    throw unauthorized("Refresh token revoked");
  }
  return claims;
}

export function revokeRefreshToken(jti?: string): void {
  if (!jti) {
    return;
  }
  revokedRefreshTokens.set(jti, Date.now());
}

export function cleanupRevokedTokens(maxAgeMs = 7 * 24 * 60 * 60 * 1000): void {
  const now = Date.now();
  for (const [jti, timestamp] of revokedRefreshTokens) {
    if (now - timestamp > maxAgeMs) {
      revokedRefreshTokens.delete(jti);
    }
  }
}
