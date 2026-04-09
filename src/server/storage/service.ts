import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";

import { minioClient, storageBucket } from "@/server/storage/config";

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
    url: `${process.env.MINIO_PUBLIC_URL ?? "http://127.0.0.1:9000"}/${storageBucket}/${objectName}`
  };
}
