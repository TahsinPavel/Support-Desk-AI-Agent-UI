import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.197'],
  async rewrites() {
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.togstec.com/api/:path*' 
      : 'http://localhost:8000/api/:path*';
    
    return [
      {
        source: '/api/:path*',
        destination: backendUrl,
      },
    ];
  },
};

export default nextConfig;