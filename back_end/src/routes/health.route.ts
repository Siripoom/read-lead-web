import { Router } from "express";
import { prisma } from "../libs/prisma";

const router = Router();

router.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      data: {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
