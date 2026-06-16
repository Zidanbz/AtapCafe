import type { FastifyInstance } from "fastify";
import {
  createMenuItemController,
  deleteOrderController,
  deleteMenuItemController,
  getAdminMenuController,
  getAdminOrdersController,
  getAdminProfileController,
  getAdminStatsController,
  loginAdminController,
  refreshAdminTokenController,
  updateAdminPasswordController,
  updateMenuItemController,
  updateOrderStatusController,
  uploadMenuImageController,
} from "../controller/admin.controller";
import type {
  AdminLoginBody,
  AdminOrdersQuery,
  MenuItemBody,
  MenuItemParams,
  OrderIdParams,
  UpdateAdminPasswordBody,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
} from "../dto/admin.dto";
import { requireAdminAuth } from "../middleware/admin-auth.middleware";

export async function adminRoutes(app: FastifyInstance) {
  app.post<{ Body: AdminLoginBody }>("/admin/auth/login", loginAdminController);
  app.post("/admin/auth/refresh", { preHandler: requireAdminAuth }, refreshAdminTokenController);
  app.get("/admin/me", { preHandler: requireAdminAuth }, getAdminProfileController);
  app.patch<{ Body: UpdateAdminPasswordBody }>(
    "/admin/password",
    { preHandler: requireAdminAuth },
    updateAdminPasswordController,
  );
  app.get("/admin/stats", { preHandler: requireAdminAuth }, getAdminStatsController);
  app.get("/admin/menu", { preHandler: requireAdminAuth }, getAdminMenuController);
  app.post("/admin/menu/image", { preHandler: requireAdminAuth }, uploadMenuImageController);
  app.post<{ Body: MenuItemBody }>("/admin/menu", { preHandler: requireAdminAuth }, createMenuItemController);
  app.patch<{ Params: MenuItemParams; Body: MenuItemBody }>(
    "/admin/menu/:id",
    { preHandler: requireAdminAuth },
    updateMenuItemController,
  );
  app.delete<{ Params: MenuItemParams }>("/admin/menu/:id", { preHandler: requireAdminAuth }, deleteMenuItemController);
  app.get<{ Querystring: AdminOrdersQuery }>("/admin/orders", { preHandler: requireAdminAuth }, getAdminOrdersController);
  app.patch<{ Params: UpdateOrderStatusParams; Body: UpdateOrderStatusBody }>(
    "/admin/orders/:id/status",
    { preHandler: requireAdminAuth },
    updateOrderStatusController,
  );
  app.delete<{ Params: OrderIdParams }>("/admin/orders/:id", { preHandler: requireAdminAuth }, deleteOrderController);
}
