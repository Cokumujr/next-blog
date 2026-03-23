import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // {whitelist unsplash.com}
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname:  "rosy-porcupine-517.eu-west-1.convex.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
