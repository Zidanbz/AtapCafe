import { OrderStatus, PaymentStatus } from "@prisma/client";
import type {
  AdminLoginBody,
  AdminLoginInput,
  CreateMenuItemInput,
  AdminOrdersInput,
  AdminOrdersQuery,
  MenuItemBody,
  MenuItemParams,
  OrderIdParams,
  UpdateAdminPasswordBody,
  UpdateAdminPasswordInput,
  UpdateMenuItemInput,
  UpdateOrderStatusBody,
  UpdateOrderStatusInput,
  UpdateOrderStatusParams,
} from "../dto/admin.dto";
import { parsePage, parseTake } from "../helper/query.helper";
import { badRequest } from "../util/http-error";

function parseDate(value: string | undefined, field: string, endOfDay = false) {
  if (!value?.trim()) {
    return undefined;
  }

  const time = endOfDay ? "23:59:59.999" : "00:00:00.000";
  const date = new Date(`${value.trim()}T${time}+08:00`);

  if (Number.isNaN(date.getTime())) {
    throw badRequest(`${field} must be a valid date.`);
  }

  return date;
}

export function validateAdminOrdersQuery(query: AdminOrdersQuery): AdminOrdersInput {
  const status = Object.values(OrderStatus).includes(query.status as OrderStatus)
    ? (query.status as OrderStatus)
    : undefined;
  const paymentStatus = Object.values(PaymentStatus).includes(query.paymentStatus as PaymentStatus)
    ? (query.paymentStatus as PaymentStatus)
    : undefined;

  return {
    search: query.search?.trim() || undefined,
    status,
    paymentStatus,
    dateFrom: parseDate(query.dateFrom, "dateFrom"),
    dateTo: parseDate(query.dateTo, "dateTo", true),
    page: parsePage(query.page),
    take: parseTake(query.take),
  };
}

export function validateAdminLoginBody(body: AdminLoginBody): AdminLoginInput {
  const username = body.username?.trim();
  const password = body.password?.trim();

  if (!username || !password) {
    throw badRequest("Username and password are required.");
  }

  return { username, password };
}

export function validateUpdateOrderStatusBody(
  params: UpdateOrderStatusParams,
  body: UpdateOrderStatusBody,
): UpdateOrderStatusInput {
  const status = Object.values(OrderStatus).includes(body.status as OrderStatus)
    ? (body.status as OrderStatus)
    : undefined;
  const paymentStatus = Object.values(PaymentStatus).includes(body.paymentStatus as PaymentStatus)
    ? (body.paymentStatus as PaymentStatus)
    : undefined;

  if (!params.id?.trim()) {
    throw badRequest("Order id is required.");
  }

  if (!status && !paymentStatus) {
    throw badRequest("status or paymentStatus is required.");
  }

  return {
    id: params.id.trim(),
    status,
    paymentStatus,
  };
}

export function validateUpdateAdminPasswordBody(body: UpdateAdminPasswordBody): UpdateAdminPasswordInput {
  const currentPassword = body.currentPassword?.trim();
  const newPassword = body.newPassword?.trim();

  if (!currentPassword || !newPassword) {
    throw badRequest("Current password and new password are required.");
  }

  if (newPassword.length < 6 || !/\d/.test(newPassword)) {
    throw badRequest("New password must be at least 6 characters and contain a number.");
  }

  return {
    currentPassword,
    newPassword,
  };
}

export function validateOrderIdParams(params: OrderIdParams) {
  const id = params.id?.trim();

  if (!id) {
    throw badRequest("Order id is required.");
  }

  return { id };
}

function validateMenuItemPrice(value: number | undefined) {
  const price = Number(value);

  if (!Number.isInteger(price) || price < 0) {
    throw badRequest("Menu item price must be a positive integer.");
  }

  return price;
}

export function validateCreateMenuItemBody(body: MenuItemBody): CreateMenuItemInput {
  const categoryId = body.categoryId?.trim();
  const name = body.name?.trim();
  const description = body.description?.trim();
  const imageUrl = body.imageUrl?.trim();

  if (!categoryId || !name || !description || !imageUrl) {
    throw badRequest("categoryId, name, description, and imageUrl are required.");
  }

  return {
    categoryId,
    name,
    description,
    price: validateMenuItemPrice(body.price),
    imageUrl,
    isAvailable: body.isAvailable ?? true,
    isFeatured: body.isFeatured ?? false,
  };
}

export function validateUpdateMenuItemBody(params: MenuItemParams, body: MenuItemBody): UpdateMenuItemInput {
  const id = params.id?.trim();

  if (!id) {
    throw badRequest("Menu item id is required.");
  }

  return {
    id,
    categoryId: body.categoryId?.trim() || undefined,
    name: body.name?.trim() || undefined,
    description: body.description?.trim() || undefined,
    price: body.price === undefined ? undefined : validateMenuItemPrice(body.price),
    imageUrl: body.imageUrl?.trim() || undefined,
    isAvailable: body.isAvailable,
    isFeatured: body.isFeatured,
  };
}
