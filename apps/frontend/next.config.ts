import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Desabilitar source maps em produção para evitar erros de parsing
  productionBrowserSourceMaps: false,
  // Suprimir warnings de hydration do Radix UI
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
};

export default nextConfig;
