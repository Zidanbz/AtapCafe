import assert from "node:assert/strict";
import test from "node:test";

test("integration: admin login, create order, and update payment status", async (t) => {
  if (process.env.RUN_INTEGRATION_TESTS !== "1" || !process.env.TEST_DATABASE_URL) {
    t.skip("Set RUN_INTEGRATION_TESTS=1 and TEST_DATABASE_URL to run database integration tests.");
    return;
  }

  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

  const { buildApp } = await import("./app.js");
  const { prisma } = await import("./config/database.js");
  const { hashPassword } = await import("./helper/password.helper.js");

  const app = await buildApp();
  t.after(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  const category = await prisma.category.upsert({
    where: { slug: "integration-minuman" },
    update: {},
    create: {
      name: "Integration Minuman",
      slug: "integration-minuman",
    },
  });
  const menuItem = await prisma.menuItem.upsert({
    where: { slug: "integration-coffee" },
    update: {
      categoryId: category.id,
      isAvailable: true,
    },
    create: {
      categoryId: category.id,
      name: "Integration Coffee",
      slug: "integration-coffee",
      description: "Integration test item",
      price: 12000,
      imageUrl: "https://example.com/integration-coffee.jpg",
      isAvailable: true,
    },
  });
  const admin = await prisma.adminUser.upsert({
    where: { username: "integration-admin" },
    update: {
      passwordHash: hashPassword("123456"),
      isActive: true,
    },
    create: {
      name: "Integration Admin",
      username: "integration-admin",
      passwordHash: hashPassword("123456"),
      role: "OWNER",
    },
  });

  const loginResponse = await app.inject({
    method: "POST",
    url: "/api/admin/auth/login",
    payload: {
      username: admin.username,
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
      items: [{ menuItemId: menuItem.id, quantity: 1 }],
    },
  });
  const order = createOrderResponse.json().data as { id: string; paymentStatus: string };

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
