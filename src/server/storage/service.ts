import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";

import { minioClient, storageBucket } from "@/server/storage/config";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function buildStorageAssetUrl(objectName: string) {
  return `/media/${encodeURIComponent(objectName)}`;
}

export function normalizeStorageUrl(url?: string | null) {
  const value = url?.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("/media/")) {
    return value;
  }

  const publicBaseUrl = process.env.MINIO_PUBLIC_URL ? trimTrailingSlash(process.env.MINIO_PUBLIC_URL) : null;
  const publicPrefix = publicBaseUrl ? `${publicBaseUrl}/${storageBucket}/` : null;

  if (publicPrefix && value.startsWith(publicPrefix)) {
    return buildStorageAssetUrl(value.slice(publicPrefix.length));
  }

  const localhostPrefix = `http://127.0.0.1:9000/${storageBucket}/`;

  if (value.startsWith(localhostPrefix)) {
    return buildStorageAssetUrl(value.slice(localhostPrefix.length));
  }

  return value;
}

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(storageBucket);

  if (!exists) {
    await minioClient.makeBucket(storageBucket, "us-east-1");
  }
}

function sanitizeFilename(original: string): string {
  const ext = extname(basename(original)).toLowerCase().slice(0, 10);
  const stem = basename(original, extname(original)).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  return `${stem}${ext}`;
}

export async function uploadFileToStorage(file: Express.Multer.File) {
  const objectName = `${randomUUID()}-${sanitizeFilename(file.originalname)}`;

  await minioClient.putObject(storageBucket, objectName, file.buffer, file.size, {
    "Content-Type": file.mimetype
  });

  return {
    objectName,
    bucket: storageBucket,
    url: buildStorageAssetUrl(objectName)
  };
}
