/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/roommate/uploads/**", // Quarkus root-path varsa
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**", // Quarkus root-path yoksa
      },
      {
        protocol: "http",
        hostname: "127.0.0.1", // Bazen localhost yerine IP gerekir
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
