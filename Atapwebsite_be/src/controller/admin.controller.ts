import type { FastifyReply, FastifyRequest } from "fastify";
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
import { createAdminToken, verifyAdminToken } from "../helper/auth-token.helper";
import {
  changeAdminPassword,
  createAdminMenuItem,
  deleteAdminOrder,
  deleteAdminMenuItem,
  getAdminDashboardStats,
  getAdminMenu,
  getAdminOrders,
  getAdminProfile,
  loginAdmin,
  updateAdminMenuItem,
  updateAdminOrderStatus,
} from "../service/admin.service";
import { saveMenuImage } from "../service/upload.service";
import { badRequest, HttpError } from "../util/http-error";
import {
  validateAdminLoginBody,
  validateAdminOrdersQuery,
  validateCreateMenuItemBody,
  validateOrderIdParams,
  validateUpdateAdminPasswordBody,
  validateUpdateMenuItemBody,
  validateUpdateOrderStatusBody,
} from "../validator/admin.validator";

function getAdminPayloadFromRequest(request: FastifyRequest) {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  const payload = token ? verifyAdminToken(token) : null;

  if (!payload) {
    throw new HttpError(401, "Admin authentication is required.");
  }

  return payload;
}

function getAdminIdFromRequest(request: FastifyRequest) {
  return getAdminPayloadFromRequest(request).sub;
}

export async function loginAdminController(request: FastifyRequest<{ Body: AdminLoginBody }>, _reply: FastifyReply) {
  const input = validateAdminLoginBody(request.body);

  return {
    data: await loginAdmin(input),
  };
}

export async function getAdminProfileController(request: FastifyRequest, _reply: FastifyReply) {
  const adminId = getAdminIdFromRequest(request);

  return {
    data: await getAdminProfile(adminId),
  };
}

export async function refreshAdminTokenController(request: FastifyRequest, _reply: FastifyReply) {
  const payload = getAdminPayloadFromRequest(request);

  return {
    data: {
      token: createAdminToken({
        sub: payload.sub,
        username: payload.username,
        role: payload.role,
      }),
      user: await getAdminProfile(payload.sub),
    },
  };
}

export async function getAdminOrdersController(
  request: FastifyRequest<{ Querystring: AdminOrdersQuery }>,
  _reply: FastifyReply,
) {
  const query = validateAdminOrdersQuery(request.query);

  return {
    data: await getAdminOrders(query),
  };
}

export async function updateOrderStatusController(
  request: FastifyRequest<{ Params: UpdateOrderStatusParams; Body: UpdateOrderStatusBody }>,
  _reply: FastifyReply,
) {
  const input = validateUpdateOrderStatusBody(request.params, request.body);

  return {
    data: await updateAdminOrderStatus(input),
  };
}

export async function deleteOrderController(
  request: FastifyRequest<{ Params: OrderIdParams }>,
  _reply: FastifyReply,
) {
  const params = validateOrderIdParams(request.params);

  return {
    data: await deleteAdminOrder(params.id),
  };
}

export async function updateAdminPasswordController(
  request: FastifyRequest<{ Body: UpdateAdminPasswordBody }>,
  _reply: FastifyReply,
) {
  const adminId = getAdminIdFromRequest(request);
  const input = validateUpdateAdminPasswordBody(request.body);

  return {
    data: await changeAdminPassword(adminId, input),
  };
}

export async function getAdminStatsController(_request: FastifyRequest, _reply: FastifyReply) {
  return {
    data: await getAdminDashboardStats(),
  };
}

export async function getAdminMenuController(_request: FastifyRequest, _reply: FastifyReply) {
  return {
    data: await getAdminMenu(),
  };
}

export async function uploadMenuImageController(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    throw badRequest("Image file is required.");
  }

  reply.status(201);

  try {
    return {
      data: await saveMenuImage(file),
    };
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("too large")) {
      throw badRequest("Image file must be 5 MB or smaller.");
    }

    throw error;
  }
}

export async function createMenuItemController(request: FastifyRequest<{ Body: MenuItemBody }>, reply: FastifyReply) {
  const input = validateCreateMenuItemBody(request.body);
  const item = await createAdminMenuItem(input);

  reply.status(201);

  return {
    data: item,
  };
}

export async function updateMenuItemController(
  request: FastifyRequest<{ Params: MenuItemParams; Body: MenuItemBody }>,
  _reply: FastifyReply,
) {
  const input = validateUpdateMenuItemBody(request.params, request.body);

  return {
    data: await updateAdminMenuItem(input),
  };
}

export async function deleteMenuItemController(request: FastifyRequest<{ Params: MenuItemParams }>, _reply: FastifyReply) {
  const params = validateOrderIdParams(request.params);

  return {
    data: await deleteAdminMenuItem(params.id),
  };
}
