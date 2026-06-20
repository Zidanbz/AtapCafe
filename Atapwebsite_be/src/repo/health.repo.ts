import { db } from "../config/database";

export async function pingDatabase() {
  await db.collection("_health").limit(1).get();
}
