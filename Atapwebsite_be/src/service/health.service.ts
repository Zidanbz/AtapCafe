import { pingDatabase } from "../repo/health.repo";

export function getServiceHealth() {
  return {
    status: "ok",
    service: "atap-api",
  };
}

export async function getDatabaseHealth() {
  await pingDatabase();

  return {
    status: "ok",
    database: "mysql",
  };
}
