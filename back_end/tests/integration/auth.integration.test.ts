import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { cleanDatabase, testPrisma } from "./helpers/db";

const shouldRun = process.env.RUN_INTEGRATION_TESTS === "1";

describe.runIf(shouldRun)("auth integration", () => {
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
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("registers, logs in, and fetches current user", async () => {
    const email = `reader-${Date.now()}@example.com`;

    const registerResponse = await request(app).post("/api/v1/auth/register").send({
      username: `reader_${Date.now()}`,
      email,
      password: "password123",
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data.user.email).toBe(email);

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email,
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.tokens.accessToken).toBeTruthy();

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.data.tokens.accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.email).toBe(email);
  });
});
