/**
 * Safari Lab - Next.js configuration
 *
 * DOCTRINE (v1.4 Build Bible): Safari Lab is static, browser-only, local-first.
 * This config enforces the no-server rule:
 *   - output: 'export'  -> static HTML export only. No Node server at runtime.
 *   - No API routes, no server actions, no runtime server dependencies.
 *   - images.unoptimized -> the built-in Image Optimization server is disabled
 *     (it would require a running server; incompatible with static export).
 *
 * If a change here needs a server feature, it violates the doctrine. Do not add
 * rewrites/redirects that require a server, middleware that runs at the edge,
 * API routes, or server actions.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Fail the build on type errors and lint errors rather than shipping them.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
