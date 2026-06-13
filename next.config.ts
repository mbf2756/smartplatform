import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { domains: ["smartetf.com.au","smartsuper.com.au","localhost"] },
  async redirects() {
    return [
      { source:"/home", destination:"/", permanent:true },
      { source:"/app", destination:"/dashboard", permanent:false },
    ];
  },
};
export default nextConfig;
