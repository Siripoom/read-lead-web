import { resourceConfigs } from "../modules/resource-config";

export function getOpenApiDocument() {
  const paths: Record<string, unknown> = {
    "/api/v1/health": {
      get: {
        summary: "Health check",
        responses: {
          200: { description: "OK" },
        },
      },
    },
    "/api/v1/auth/register": { post: { summary: "Register user" } },
    "/api/v1/auth/login": { post: { summary: "Login" } },
    "/api/v1/auth/refresh": { post: { summary: "Refresh token" } },
    "/api/v1/auth/logout": { post: { summary: "Logout" } },
    "/api/v1/auth/me": { get: { summary: "Current user" } },
    "/api/v1/workflows/topups/{id}/mark-paid": { post: { summary: "Mark topup paid" } },
    "/api/v1/workflows/purchases/chapters": { post: { summary: "Purchase chapter" } },
    "/api/v1/workflows/purchases/packages": { post: { summary: "Purchase package" } },
    "/api/v1/workflows/payout-requests/{id}/approve": { post: { summary: "Approve payout request" } },
    "/api/v1/workflows/payout-requests/{id}/reject": { post: { summary: "Reject payout request" } },
    "/api/v1/workflows/payouts": { post: { summary: "Create payout" } },
  };

  for (const resource of Object.values(resourceConfigs)) {
    paths[`/api/v1/${resource.name}`] = {
      get: { summary: `List ${resource.name}` },
      post: { summary: `Create ${resource.name}` },
    };

    paths[`/api/v1/${resource.name}/{id}`] = {
      get: { summary: `Get ${resource.name} by id` },
      patch: { summary: `Update ${resource.name}` },
      delete: { summary: `Delete ${resource.name}` },
    };
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "Fiction Platform API",
      version: "1.0.0",
      description: "REST API for Fiction Platform MVP",
    },
    servers: [{ url: "/" }],
    tags: [
      { name: "Auth" },
      { name: "Resources" },
      { name: "Workflows" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths,
  };
}
