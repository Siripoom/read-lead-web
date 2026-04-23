import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./libs/prisma";
import { buildApp } from "./app";

async function bootstrap() {
  const app = buildApp();

  await prisma.$connect();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server started on port ${env.PORT}`);
  });

  const shutdown = async () => {
    logger.info("Shutting down server");
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  logger.error({ err: error }, "Failed to bootstrap app");
  process.exit(1);
});
