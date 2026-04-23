import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { hashPassword } from "../../src/libs/password";
import { cleanDatabase, testPrisma } from "./helpers/db";

const shouldRun = process.env.RUN_INTEGRATION_TESTS === "1";

describe.runIf(shouldRun)("rbac integration", () => {
  let app: ReturnType<typeof import("../../src/app")["buildApp"]>;

  beforeAll(async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: process.env,
    });

    const appModule = await import("../../src/app");
    app = appModule.buildApp();
  });

  beforeEach(async () => {
    await cleanDatabase();

    const hashed = await hashPassword("password123");

    await testPrisma.user.create({
      data: {
        username: "normal_user",
        email: "normal_user@example.com",
        passwordHash: hashed,
        role: "user",
      },
    });
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("denies regular user from admin-only users list", async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "normal_user@example.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);

    const usersResponse = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${loginResponse.body.data.tokens.accessToken}`);

    expect(usersResponse.status).toBe(403);
    expect(usersResponse.body.error.code).toBe("FORBIDDEN");
  });
});
