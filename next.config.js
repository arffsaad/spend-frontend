/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: "/api/auth/:path*",
            destination: process.env.BACKEND_HOST + "/api/auth/:path*",
          },
          {
            source: "/api/:path*",
            destination: process.env.BACKEND_HOST + "/api/v1/:path*",
          },
        ];
    },
    images: {
      domains: [(new URL(process.env.NEXT_PUBLIC_MINIO_HOST)).host],
    },
}

module.exports = nextConfig
// http://localhost:8080/api/v1/