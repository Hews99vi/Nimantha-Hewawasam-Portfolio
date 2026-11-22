import type { NextConfig } from "next";
const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storage = storageUrl ? new URL(storageUrl) : null;
const nextConfig: NextConfig = {
  output: "standalone",
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
