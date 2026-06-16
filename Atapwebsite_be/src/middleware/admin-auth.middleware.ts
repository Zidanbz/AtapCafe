import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAdminToken } from "../helper/auth-token.helper";
import { HttpError } from "../util/http-error";

export async function requireAdminAuth(request: FastifyRequest, _reply: FastifyReply) {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  const payload = token ? verifyAdminToken(token) : null;

  if (!payload) {
    throw new HttpError(401, "Admin authentication is required.");
  }
}
