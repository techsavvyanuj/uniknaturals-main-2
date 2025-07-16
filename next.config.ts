import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'abso-essentials.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '**',
      },
      // Payment logos (PhonePe, GPay, Paytm)
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/QtexZdJ9C_EsgMNrvNLdCJDdCuSQ5Z5q3u9xKDDcL3I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJhL2Nm/L2I2LzJhY2ZiNmZi/NDFmN2ZjYjgyYzMy/MzBhZmRlY2ZmNzE0/LmpwZw',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/Pous46AXcI4Shlnd4Q1nFHrkWtV43AUCbdaibBBS4fY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvbG9nb3MtYnJh/bmRzLWluLWNvbG9y/cy80MzYvR29vZ2xl/X1BheV9HUGF5X0xv/Z28tNTEyLnBuZw',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/sXySTlPgVT-cLoV9SlP0JxSibEmr1R_iC_rdl7m65mE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cHJpbWFyeW1hcmtl/dHMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzA5L1Bh/eXRtLUNpcmNsZS1M/b2dvLndlYnA',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'uniknaturals-backend.onrender.com', // your backend host
        pathname: '/uploads/**', // where images are served from
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/QtexZdJ9C_EsgMNrvNLdCJDdCuSQ5Z5q3u9xKDDcL3I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJhL2Nm/L2I2LzJhY2ZiNmZi/NDFmN2ZjYjgyYzMy/MzBhZmRlY2ZmNzE0/LmpwZw',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/Pous46AXcI4Shlnd4Q1nFHrkWtV43AUCbdaibBBS4fY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvbG9nb3MtYnJh/bmRzLWluLWNvbG9y/cy80MzYvR29vZ2xl/X1BheV9HUGF5X0xv/Z28tNTEyLnBuZw',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/sXySTlPgVT-cLoV9SlP0JxSibEmr1R_iC_rdl7m65mE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cHJpbWFyeW1hcmtl/dHMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzA5L1Bh/eXRtLUNpcmNsZS1M/b2dvLndlYnA',
      },
    ],
  },
  // Add CORS headers for video resources
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
