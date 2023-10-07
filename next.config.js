/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: "/api/auth/:path*",
            destination: "http://localhost:8080/api/auth/:path*",
          },
          {
            source: "/api/:path*",
            destination: "http://localhost:8080/api/v1/:path*",
          },
          {
            source: "/cdn/:path*",
            destination: "http://localhost:9000/spend-bucket/:path*",
          }
        ];
    },
}

module.exports = nextConfig
// http://localhost:8080/api/v1/