import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    unoptimized: process.env.TAURI_EXPORT === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/telemetry', permanent: false },
      { source: '/admin/dashboard', destination: '/admin/telemetry', permanent: false },
      { source: '/mlops', destination: '/mlops/models', permanent: false },
      { source: '/mlops/dashboard', destination: '/mlops/models', permanent: false },
      { source: '/audit', destination: '/audit/overview', permanent: false },
      { source: '/audit/dashboard', destination: '/audit/overview', permanent: false },
      { source: '/region', destination: '/region/dashboard', permanent: false },
      { source: '/region-dashboard', destination: '/region/dashboard', permanent: false },
      { source: '/institution', destination: '/institution/dashboard', permanent: false },
      { source: '/dept', destination: '/dept/dashboard', permanent: false },
      { source: '/dept/challenges', destination: '/dept/challenges/templates', permanent: false },
      { source: '/student', destination: '/student/dashboard', permanent: false },
      { source: '/user', destination: '/user/dashboard', permanent: false },
      { source: '/user-dashboard', destination: '/user/dashboard', permanent: false },
      { source: '/household-dashboard', destination: '/user/dashboard', permanent: false },
      { source: '/security', destination: '/security/db-claims', permanent: false },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
