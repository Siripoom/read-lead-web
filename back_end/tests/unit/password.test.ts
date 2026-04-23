import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../../src/libs/password";

describe("password utils", () => {
  it("hashes and verifies a password", async () => {
    const plain = "password123";
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    await expect(verifyPassword(plain, hashed)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hashed)).resolves.toBe(false);
  });
});
