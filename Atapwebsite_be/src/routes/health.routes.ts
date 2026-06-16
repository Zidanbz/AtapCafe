import type { FastifyInstance } from "fastify";
import { getDatabaseHealthController, getServiceHealthController } from "../controller/health.controller";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", getServiceHealthController);
  app.get("/health/database", getDatabaseHealthController);
}
