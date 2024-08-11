/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "X-Custom-Header", value: "my-value" }],
      },
    ];
  },
};

export default nextConfig;
