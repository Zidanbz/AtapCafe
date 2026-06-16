import "dotenv/config";
import { buildApp } from "./app";
import { prisma } from "./config/database";

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

async function main() {
  const app = await buildApp();

  const close = async () => {
    await app.close();
    await prisma.$disconnect();
  };

  process.on("SIGINT", close);
  process.on("SIGTERM", close);

  await app.listen({ port, host });
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
