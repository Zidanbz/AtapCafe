import type { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import { storage } from "../config/database";
import { badRequest } from "../util/http-error";

const menuUploadPrefix = "menu";
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function getFirebaseStorageDownloadUrl(bucketName: string, filePath: string, token: string) {
  const encodedPath = encodeURIComponent(filePath);

  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
}

export async function saveMenuImage(file: MultipartFile) {
  const extension = allowedImageTypes.get(file.mimetype);

  if (!extension) {
    throw badRequest("Only JPG, PNG, WEBP, or GIF images can be uploaded.");
  }

  const buffer = await file.toBuffer();
  const filename = `${randomUUID()}.${extension}`;
  const filePath = `${menuUploadPrefix}/${filename}`;
  const downloadToken = randomUUID();
  const bucket = storage.bucket();

  await bucket.file(filePath).save(buffer, {
    contentType: file.mimetype,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
    resumable: false,
  });

  return {
    imageUrl: getFirebaseStorageDownloadUrl(bucket.name, filePath, downloadToken),
  };
}
