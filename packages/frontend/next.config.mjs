/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["common"],
  reactStrictMode: true,
  output: "standalone",
};

export default nextConfig;
