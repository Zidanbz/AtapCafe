import { prisma } from "../config/database";

export async function pingDatabase() {
  await prisma.$queryRaw`SELECT 1`;
}
