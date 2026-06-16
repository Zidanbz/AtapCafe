import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateOrderBody } from "../dto/orders.dto";
import { createOrder } from "../service/orders.service";
import { validateCreateOrderBody } from "../validator/orders.validator";

export async function createOrderController(request: FastifyRequest<{ Body: CreateOrderBody }>, reply: FastifyReply) {
  const input = validateCreateOrderBody(request.body);
  const order = await createOrder(input);

  reply.status(201);

  return {
    data: order,
  };
}
