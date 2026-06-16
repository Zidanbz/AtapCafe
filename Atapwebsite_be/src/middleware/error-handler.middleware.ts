import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../util/http-error";

export function errorHandler(app: FastifyInstance) {
  return (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof HttpError) {
      reply.status(error.statusCode).send({
        error: error.message,
      });
      return;
    }

    app.log.error(error);
    reply.status(500).send({
      error: "Internal server error",
    });
  };
}
