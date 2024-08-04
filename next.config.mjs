/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pattern50.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
