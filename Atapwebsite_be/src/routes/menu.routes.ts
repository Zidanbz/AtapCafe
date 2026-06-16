import type { FastifyInstance } from "fastify";
import { getCategoriesController, getMenuController } from "../controller/menu.controller";
import type { MenuQuery } from "../dto/menu.dto";

export async function menuRoutes(app: FastifyInstance) {
  app.get("/categories", getCategoriesController);
  app.get<{ Querystring: MenuQuery }>("/menu", getMenuController);
}
