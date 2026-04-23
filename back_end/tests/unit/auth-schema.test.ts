import { describe, expect, it } from "vitest";
import { loginSchema, refreshSchema, registerSchema } from "../../src/modules/auth/auth.schema";

describe("auth schema", () => {
  it("validates register payload", () => {
    const parsed = registerSchema.safeParse({
      username: "reader001",
      email: "reader@example.com",
      password: "password123",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid login payload", () => {
    const parsed = loginSchema.safeParse({
      email: "invalid-email",
      password: "123",
    });

    expect(parsed.success).toBe(false);
  });

  it("validates refresh payload", () => {
    const parsed = refreshSchema.safeParse({ refreshToken: "abc1234567" });
    expect(parsed.success).toBe(true);
  });
});
