import assert from "node:assert/strict";
import test from "node:test";
import { dateToFirestore, db, closeDatabase } from "./config/database";
import { AdminRole } from "./entity/domain.entity";
import { hashPassword } from "./helper/password.helper";

test("integration: admin login, create order, and update payment status", async (t) => {
  if (process.env.RUN_INTEGRATION_TESTS !== "1" || !process.env.FIREBASE_PROJECT_ID) {
    t.skip("Set RUN_INTEGRATION_TESTS=1 and FIREBASE_PROJECT_ID to run Firebase integration tests.");
    return;
  }

  const { buildApp } = await import("./app.js");
  const app = await buildApp();
  const now = new Date();

  t.after(async () => {
    await db.collection("menuItems").doc("integration-coffee").delete();
    await db.collection("categories").doc("integration-minuman").delete();
    await db.collection("adminUsers").doc("integration-admin").delete();
    await app.close();
    await closeDatabase();
  });

  await db.collection("categories").doc("integration-minuman").set({
    name: "Integration Minuman",
    slug: "integration-minuman",
    displayOrder: 99,
    isActive: true,
    createdAt: dateToFirestore(now),
    updatedAt: dateToFirestore(now),
  });
  await db.collection("menuItems").doc("integration-coffee").set({
    categoryId: "integration-minuman",
    name: "Integration Coffee",
    slug: "integration-coffee",
    description: "Integration test item",
    price: 12000,
    imageUrl: "https://example.com/integration-coffee.jpg",
    isAvailable: true,
    isFeatured: false,
    createdAt: dateToFirestore(now),
    updatedAt: dateToFirestore(now),
  });
  await db.collection("adminUsers").doc("integration-admin").set({
    name: "Integration Admin",
    username: "integration-admin",
    passwordHash: hashPassword("123456"),
    role: AdminRole.OWNER,
    isActive: true,
    createdAt: dateToFirestore(now),
    updatedAt: dateToFirestore(now),
  });

  const loginResponse = await app.inject({
    method: "POST",
    url: "/api/admin/auth/login",
    payload: {
      username: "integration-admin",
      password: "123456",
    },
  });
  const token = loginResponse.json().data.token as string;

  assert.equal(loginResponse.statusCode, 200);
  assert.ok(token);

  const createOrderResponse = await app.inject({
    method: "POST",
    url: "/api/orders",
    payload: {
      tableCode: "IN-TEST",
      customerName: "Integration Customer",
      paymentMethod: "QRIS",
      items: [{ menuItemId: "integration-coffee", quantity: 1 }],
    },
  });
  const order = createOrderResponse.json().data as { id: string; paymentStatus: string };

  t.after(async () => {
    if (order?.id) {
      await db.collection("orders").doc(order.id).delete();
    }
  });

  assert.equal(createOrderResponse.statusCode, 201);
  assert.equal(order.paymentStatus, "PENDING");

  const updateResponse = await app.inject({
    method: "PATCH",
    url: `/api/admin/orders/${order.id}/status`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      paymentStatus: "PAID",
    },
  });

  assert.equal(updateResponse.statusCode, 200);
  assert.equal(updateResponse.json().data.paymentStatus, "PAID");
});
