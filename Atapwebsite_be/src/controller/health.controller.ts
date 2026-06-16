import type { FastifyReply, FastifyRequest } from "fastify";
import { getDatabaseHealth, getServiceHealth } from "../service/health.service";

export async function getServiceHealthController(_request: FastifyRequest, _reply: FastifyReply) {
  return getServiceHealth();
}

export async function getDatabaseHealthController(_request: FastifyRequest, reply: FastifyReply) {
  try {
    return await getDatabaseHealth();
  } catch (error) {
    reply.status(503);

    return {
      status: "error",
      database: "mysql",
      message: error instanceof Error ? error.message : "Database connection failed",
    };
  }
}
