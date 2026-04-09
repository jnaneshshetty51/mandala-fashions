import type { NextConfig } from "next";

function getRemotePatterns() {
  const patterns: { protocol: "http" | "https"; hostname: string }[] = [];

  const minioPublicUrl = process.env.MINIO_PUBLIC_URL;
  if (minioPublicUrl) {
    try {
      const { hostname, protocol } = new URL(minioPublicUrl);
      const proto = protocol.replace(":", "") as "http" | "https";
      patterns.push({ protocol: proto, hostname });
    } catch {
      // Invalid MINIO_PUBLIC_URL — skip
    }
  }

  // Allow localhost in non-production environments
  if (process.env.NODE_ENV !== "production") {
    patterns.push({ protocol: "http", hostname: "127.0.0.1" });
    patterns.push({ protocol: "http", hostname: "localhost" });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: getRemotePatterns()
  }
};

export default nextConfig;
