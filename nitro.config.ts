import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  compatibilityDate: '2025-09-30',

  // Set preset for Netlify deployment
  // eslint-disable-next-line node/no-process-env
  preset: process.env.NETLIFY ? 'netlify' : undefined,

  // Configure the dev server
  devServer: {
    port: 3001,
  },

  // Enable experimental features
  experimental: {
    wasm: true,
  },

  // Route rules for better caching and performance
  routeRules: {
    '/api/og/**': {
      cache: {
        maxAge: 3600, // 1 hour
        sMaxAge: 86400, // 1 day for CDN
      },
      headers: {
        'cache-control': 'public, max-age=3600, s-maxage=86400',
      },
    },
    '/api/**': {
      cors: true,
      headers: {
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'Content-Type, Authorization',
      },
    },
  },
});
