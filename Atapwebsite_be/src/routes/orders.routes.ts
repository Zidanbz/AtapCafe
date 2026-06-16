import type { FastifyInstance } from "fastify";
import { createOrderController } from "../controller/orders.controller";
import type { CreateOrderBody } from "../dto/orders.dto";

export async function orderRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateOrderBody }>("/orders", createOrderController);
}
