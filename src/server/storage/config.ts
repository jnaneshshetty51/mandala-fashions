import { Client } from "minio";

const endPoint = process.env.MINIO_ENDPOINT ?? "127.0.0.1";
const port = Number(process.env.MINIO_PORT ?? 9000);
const useSSL = (process.env.MINIO_USE_SSL ?? "false") === "true";
const accessKey = process.env.MINIO_ACCESS_KEY ?? "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY ?? "minioadmin";
const bucketName = process.env.MINIO_BUCKET ?? "mandala-assets";

export const storageBucket = bucketName;

export const minioClient = new Client({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey
});
