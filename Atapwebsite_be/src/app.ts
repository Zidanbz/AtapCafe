import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { errorHandler } from "./middleware/error-handler.middleware";
import { adminRoutes } from "./routes/admin.routes";
import { healthRoutes } from "./routes/health.routes";
import { menuRoutes } from "./routes/menu.routes";
import { orderRoutes } from "./routes/orders.routes";
import { uploadRoutes } from "./routes/upload.routes";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
    origin: true,
  });
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
  });

  app.setErrorHandler(errorHandler(app));

  await app.register(healthRoutes);
  await app.register(uploadRoutes);
  await app.register(adminRoutes, { prefix: "/api" });
  await app.register(menuRoutes, { prefix: "/api" });
  await app.register(orderRoutes, { prefix: "/api" });

  return app;
}
