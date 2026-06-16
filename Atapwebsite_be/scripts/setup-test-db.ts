import { spawnSync } from "node:child_process";

function quoteIdentifier(value: string) {
  return `\`${value.replace(/`/g, "``")}\``;
}

function run(command: string, args: string[], env = process.env) {
  const result = spawnSync(command, args, {
    env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const databaseUrl = process.env.TEST_DATABASE_URL;

if (!databaseUrl) {
  console.error("TEST_DATABASE_URL is required.");
  process.exit(1);
}

const url = new URL(databaseUrl);
const databaseName = decodeURIComponent(url.pathname.replace(/^\//, ""));

if (!databaseName) {
  console.error("TEST_DATABASE_URL must include a database name.");
  process.exit(1);
}

const mysqlArgs = [
  "--protocol=TCP",
  `--host=${url.hostname || "localhost"}`,
  `--port=${url.port || "3306"}`,
  `--user=${decodeURIComponent(url.username)}`,
];

if (url.password) {
  mysqlArgs.push(`--password=${decodeURIComponent(url.password)}`);
}

mysqlArgs.push(
  "--execute",
  `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(databaseName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
);

run("mysql", mysqlArgs);
run("npx", ["prisma", "db", "push", "--skip-generate"], {
  ...process.env,
  DATABASE_URL: databaseUrl,
});
