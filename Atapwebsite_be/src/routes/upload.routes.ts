import type { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { notFound } from "../util/http-error";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function isSafeMenuImageFilename(filename: string) {
  return /^[a-f0-9-]+\.(gif|jpe?g|png|webp)$/i.test(filename);
}

export async function uploadRoutes(app: FastifyInstance) {
  app.get<{ Params: { filename: string } }>("/uploads/menu/:filename", async (request, reply) => {
    const { filename } = request.params;

    if (!isSafeMenuImageFilename(filename)) {
      throw notFound("Uploaded image not found.");
    }

    const filePath = path.resolve(uploadRoot, "menu", filename);
    const menuDir = path.resolve(uploadRoot, "menu");

    if (!filePath.startsWith(`${menuDir}${path.sep}`)) {
      throw notFound("Uploaded image not found.");
    }

    try {
      await access(filePath);
    } catch {
      throw notFound("Uploaded image not found.");
    }

    reply.type(contentTypes[path.extname(filename).toLowerCase()] ?? "application/octet-stream");
    return reply.send(createReadStream(filePath));
  });
}
