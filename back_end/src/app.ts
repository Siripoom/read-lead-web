import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { getOpenApiDocument } from "./config/openapi";
import { errorHandler } from "./middlewares/error.middleware";
import apiRouter from "./routes";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(getOpenApiDocument()));
  app.use("/api/v1", apiRouter);

  app.use(errorHandler);

  return app;
}
