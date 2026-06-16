import assert from "node:assert/strict";
import test from "node:test";
import { buildApp } from "./app";

test("GET /health returns service status", async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    status: "ok",
    service: "atap-api",
  });
});

test("GET /api/admin/orders requires admin auth", async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const response = await app.inject({
    method: "GET",
    url: "/api/admin/orders",
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.json().error, "Admin authentication is required.");
});

test("PATCH /api/admin/orders/:id/status requires admin auth", async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const response = await app.inject({
    method: "PATCH",
    url: "/api/admin/orders/order-id/status",
    payload: {
      status: "COMPLETED",
    },
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.json().error, "Admin authentication is required.");
});

test("POST /api/orders validates empty order items before database access", async (t) => {
  const app = await buildApp();
  t.after(() => app.close());

  const response = await app.inject({
    method: "POST",
    url: "/api/orders",
    payload: {
      tableCode: "IN-01",
      items: [],
    },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().error, "Order must contain at least one item.");
});
