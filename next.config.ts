import type { NextConfig } from "next";
import { validateEnvironment } from "./lib/environment";
import { baselineHeaders, contentSecurityPolicy } from "./lib/security";
if (process.env.NODE_ENV === "production") validateEnvironment();
const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storage = storageUrl ? new URL(storageUrl) : null;
const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      { source: "/:path*", headers: baselineHeaders },
      // Admin gets a fresh nonce policy in proxy.ts. Keep public ISR HTML cacheable.
      { source: "/((?!admin(?:/|$)|api/admin(?:/|$)).*)", headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy() }] },
    ];
  },
  images: {
    qualities: [90, 95],
    maximumRedirects: 0,
    deviceSizes: [390, 640, 768, 1080, 1440, 1920, 2560, 3200],
    remotePatterns: storage
      ? [
          {
            protocol: storage.protocol === "https:" ? "https" : "http",
            hostname: storage.hostname,
            port: storage.port,
            pathname: "/storage/v1/object/public/project-images/**",
            search: "",
          },
        ]
      : [],
  },
};
export default nextConfig;
