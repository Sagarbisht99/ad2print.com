import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  async redirects() {
    return [
      { source: "/categories/matrimonial", destination: "/matrimonial", permanent: true },
      { source: "/categories/court-notice", destination: "/tender-notice", permanent: true },
      { source: "/categories/change-of-name", destination: "/change-my-name", permanent: true },
      { source: "/categories/recruitment", destination: "/recruitment", permanent: true },
      { source: "/categories/obituary", destination: "/obituary", permanent: true },
      { source: "/categories/property", destination: "/property", permanent: true },
      { source: "/categories/lost-and-found", destination: "/lost-and-found", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.releasemyad.com",
        pathname: "/newspaper-logo/**",
      },
      {
        protocol: "https",
        hostname: "www.releasemyad.com",
        pathname: "/assets/microsite/assets/news-samples/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
};

export default nextConfig;