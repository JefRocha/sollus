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
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.102:3000',
  ],
  async headers() {
    const securityHeaders = [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), usb=(), payment=()" },
      // CSP relaxada para não quebrar desenvolvimento; aplicada em produção via runtime
      { key: "Content-Security-Policy", value: process.env.NODE_ENV === "production"
          ? "default-src 'self'; img-src 'self' data: blob: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' http://localhost:4000 https://localhost:4000 https:; frame-ancestors 'none'"
          : "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; connect-src *;"
      },
    ];
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
