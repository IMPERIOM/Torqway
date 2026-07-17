import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images used by the seed data
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage (product-media / project-media public URLs)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
