import type { FastifyReply, FastifyRequest } from "fastify";
import type { MenuQuery } from "../dto/menu.dto";
import { getCategories, getMenu } from "../service/menu.service";
import { validateMenuQuery } from "../validator/menu.validator";

export async function getCategoriesController(_request: FastifyRequest, _reply: FastifyReply) {
  return {
    data: await getCategories(),
  };
}

export async function getMenuController(request: FastifyRequest<{ Querystring: MenuQuery }>, _reply: FastifyReply) {
  const query = validateMenuQuery(request.query);

  return {
    data: await getMenu(query.category),
  };
}
