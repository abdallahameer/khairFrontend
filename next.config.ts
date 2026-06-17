import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-560828ac4d84492abdfd99f47eb0479e.r2.dev",
      },
    ],
  },
};

export default nextConfig;
