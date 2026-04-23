import { describe, expect, it } from "vitest";
import { issueTokenPair, revokeRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../src/libs/jwt";

describe("jwt utils", () => {
  it("issues access + refresh tokens with expected claims", () => {
    const pair = issueTokenPair("1", "user");

    const accessClaims = verifyAccessToken(pair.accessToken);
    const refreshClaims = verifyRefreshToken(pair.refreshToken);

    expect(accessClaims.sub).toBe("1");
    expect(accessClaims.tokenType).toBe("access");
    expect(refreshClaims.tokenType).toBe("refresh");
    expect(refreshClaims.jti).toBeDefined();
  });

  it("revokes refresh token by jti", () => {
    const pair = issueTokenPair("1", "user");
    const claims = verifyRefreshToken(pair.refreshToken);

    revokeRefreshToken(claims.jti);

    expect(() => verifyRefreshToken(pair.refreshToken)).toThrowError("Refresh token revoked");
  });
});
