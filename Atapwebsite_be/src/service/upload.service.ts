import type { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { badRequest } from "../util/http-error";

const menuUploadDir = path.resolve(process.cwd(), "uploads", "menu");
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function saveMenuImage(file: MultipartFile, baseUrl: string) {
  const extension = allowedImageTypes.get(file.mimetype);

  if (!extension) {
    throw badRequest("Only JPG, PNG, WEBP, or GIF images can be uploaded.");
  }

  const buffer = await file.toBuffer();
  const filename = `${randomUUID()}.${extension}`;

  await mkdir(menuUploadDir, { recursive: true });
  await writeFile(path.join(menuUploadDir, filename), buffer);

  return {
    imageUrl: `${baseUrl}/uploads/menu/${filename}`,
  };
}
