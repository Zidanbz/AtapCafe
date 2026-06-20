import { db, dateToFirestore, firestoreToDate, mapDoc } from "../config/database";
import type {
  AdminMenuItemWithCategory,
  AdminUser,
  Category,
  DiningTable,
  MenuItem,
  Order,
  Payment,
} from "../entity/domain.entity";
import type { AdminOrdersInput, CreateMenuItemInput, UpdateMenuItemInput, UpdateOrderStatusInput } from "../dto/admin.dto";
import { attachOrderDetails, normalizeOrder } from "./orders.repo";

function normalizeCategory(category: Category): Category {
  return {
    ...category,
    displayOrder: category.displayOrder ?? 0,
    isActive: category.isActive ?? true,
    createdAt: firestoreToDate(category.createdAt),
    updatedAt: firestoreToDate(category.updatedAt),
  };
}

function normalizeMenuItem(menuItem: MenuItem): MenuItem {
  return {
    ...menuItem,
    isAvailable: menuItem.isAvailable ?? true,
    isFeatured: menuItem.isFeatured ?? false,
    createdAt: firestoreToDate(menuItem.createdAt),
    updatedAt: firestoreToDate(menuItem.updatedAt),
  };
}

function normalizeAdminUser(user: AdminUser): AdminUser {
  return {
    ...user,
    isActive: user.isActive ?? true,
    createdAt: firestoreToDate(user.createdAt),
    updatedAt: firestoreToDate(user.updatedAt),
  };
}

function normalizeTable(table: DiningTable): DiningTable {
  return {
    ...table,
    createdAt: firestoreToDate(table.createdAt),
    updatedAt: firestoreToDate(table.updatedAt),
  };
}

function matchesAdminOrderInput(order: Order, input: AdminOrdersInput, tableById: Map<string, DiningTable>) {
  const search = input.search?.toLowerCase();
  const table = order.tableId ? tableById.get(order.tableId) : null;
  const searchable = [
    order.orderNumber,
    order.customerName,
    order.customerContact,
    table?.code,
    table?.area,
    ...order.items.map((item) => item.nameSnapshot),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    (!search || searchable.includes(search)) &&
    (!input.status || order.status === input.status) &&
    (!input.paymentStatus || order.paymentStatus === input.paymentStatus) &&
    (!input.dateFrom || order.createdAt >= input.dateFrom) &&
    (!input.dateTo || order.createdAt <= input.dateTo)
  );
}

async function getAllOrders() {
  const snapshot = await db.collection("orders").get();

  return snapshot.docs.map((doc) => normalizeOrder({ id: doc.id, ...doc.data() } as Order));
}

async function getDiningTableMap() {
  const snapshot = await db.collection("diningTables").get();

  return new Map(snapshot.docs.map((doc) => [doc.id, normalizeTable({ id: doc.id, ...doc.data() } as DiningTable)]));
}

async function findCategoryById(id: string) {
  const doc = await db.collection("categories").doc(id).get();

  return doc.exists ? normalizeCategory({ id: doc.id, ...doc.data() } as Category) : null;
}

export async function findAdminOrders(input: AdminOrdersInput) {
  const tableById = await getDiningTableMap();
  const orders = (await getAllOrders())
    .filter((order) => matchesAdminOrderInput(order, input, tableById))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .slice((input.page - 1) * input.take, input.page * input.take);

  return Promise.all(orders.map(attachOrderDetails));
}

export async function countAdminOrders(input: AdminOrdersInput) {
  const tableById = await getDiningTableMap();

  return (await getAllOrders()).filter((order) => matchesAdminOrderInput(order, input, tableById)).length;
}

export async function findActiveAdminUserByUsername(username: string) {
  const snapshot = await db
    .collection("adminUsers")
    .where("username", "==", username)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  return snapshot.empty ? null : normalizeAdminUser(mapDoc<AdminUser>(snapshot.docs[0]));
}

export async function findActiveAdminUserById(id: string) {
  const doc = await db.collection("adminUsers").doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const user = normalizeAdminUser({ id: doc.id, ...doc.data() } as AdminUser);

  return user.isActive ? user : null;
}

export async function updateAdminPasswordHash(id: string, passwordHash: string) {
  await db.collection("adminUsers").doc(id).update({
    passwordHash,
    updatedAt: dateToFirestore(new Date()),
  });

  const user = await findActiveAdminUserById(id);
  if (!user) {
    throw new Error("Admin user not found.");
  }

  return user;
}

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  const ref = db.collection("orders").doc(input.id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Order not found.");
  }

  const order = normalizeOrder({ id: doc.id, ...doc.data() } as Order);
  const now = new Date();
  const payment: Payment | null = order.payment
    ? {
        ...order.payment,
        status: input.paymentStatus ?? order.payment.status,
        paidAt: input.paymentStatus === "PAID" ? now : order.payment.paidAt,
        updatedAt: now,
      }
    : null;

  await ref.update({
    status: input.status ?? order.status,
    paymentStatus: input.paymentStatus ?? order.paymentStatus,
    updatedAt: dateToFirestore(now),
    ...(payment
      ? {
          payment: {
            ...payment,
            paidAt: dateToFirestore(payment.paidAt),
            createdAt: dateToFirestore(payment.createdAt),
            updatedAt: dateToFirestore(payment.updatedAt),
          },
        }
      : {}),
  });

  const updated = await ref.get();
  return attachOrderDetails({ id: updated.id, ...updated.data() } as Order);
}

export async function deleteOrderById(id: string) {
  const ref = db.collection("orders").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Order not found.");
  }

  await ref.delete();
  return attachOrderDetails({ id: doc.id, ...doc.data() } as Order);
}

export async function getAdminStats() {
  const [orders, menuSnapshot] = await Promise.all([
    getAllOrders(),
    db.collection("menuItems").where("isAvailable", "==", true).get(),
  ]);

  return {
    totalOrders: orders.length,
    totalRevenue: orders.filter((order) => order.paymentStatus === "PAID").reduce((total, order) => total + order.total, 0),
    activeMenuItems: menuSnapshot.size,
  };
}

export async function findAdminMenuCategories() {
  const snapshot = await db.collection("categories").where("isActive", "==", true).get();

  return snapshot.docs
    .map((doc) => normalizeCategory(mapDoc<Category>(doc)))
    .sort((left, right) => left.displayOrder - right.displayOrder || left.name.localeCompare(right.name));
}

export async function findAdminMenuItems() {
  const [itemsSnapshot, categories] = await Promise.all([db.collection("menuItems").get(), findAdminMenuCategories()]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return itemsSnapshot.docs
    .map((doc) => normalizeMenuItem(mapDoc<MenuItem>(doc)))
    .filter((item) => !item.slug.startsWith("deleted-"))
    .map<AdminMenuItemWithCategory>((item) => ({
      ...item,
      category: categoryById.get(item.categoryId) ?? {
        id: item.categoryId,
        name: "Unknown",
        slug: "unknown",
        displayOrder: 0,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }))
    .sort(
      (left, right) =>
        Number(right.isAvailable) - Number(left.isAvailable) ||
        Number(right.isFeatured) - Number(left.isFeatured) ||
        left.name.localeCompare(right.name),
    );
}

export async function findMenuItemBySlug(slug: string) {
  const snapshot = await db.collection("menuItems").where("slug", "==", slug).limit(1).get();

  return snapshot.empty ? null : normalizeMenuItem(mapDoc<MenuItem>(snapshot.docs[0]));
}

export async function createMenuItem(input: CreateMenuItemInput & { slug: string }) {
  const category = await findCategoryById(input.categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  const now = new Date();
  const ref = db.collection("menuItems").doc();
  const item: Omit<MenuItem, "id"> = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set({
    ...item,
    createdAt: dateToFirestore(item.createdAt),
    updatedAt: dateToFirestore(item.updatedAt),
  });

  return {
    id: ref.id,
    ...item,
    category,
  };
}

export async function updateMenuItem(input: UpdateMenuItemInput & { slug?: string }) {
  const { id, ...data } = input;
  const ref = db.collection("menuItems").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Menu item not found.");
  }

  const updateData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  await ref.update({
    ...updateData,
    updatedAt: dateToFirestore(new Date()),
  });

  const updated = normalizeMenuItem({ id, ...((await ref.get()).data() as Omit<MenuItem, "id">) });
  const category = await findCategoryById(updated.categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  return {
    ...updated,
    category,
  };
}

export async function deleteMenuItem(id: string) {
  const item = await updateMenuItem({
    id,
    slug: `deleted-${id}`,
    isAvailable: false,
    isFeatured: false,
  });

  await db.collection("menuItems").doc(id).delete();
  return item;
}
