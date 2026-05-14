import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Build the CSP as an array so each directive stays readable.
// unsafe-inline is required by Next.js App Router (inline hydration scripts + Tailwind styles).
// unsafe-eval is required only by React development tooling for debugging features.
// To tighten this further, implement nonce-based CSP via middleware (see SECURITY.md).
const isDevelopment = process.env.NODE_ENV === 'development';
const scriptSrcDirective = [
  "script-src 'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  'https://va.vercel-scripts.com',
].join(' ');

const cspDirectives = [
  "default-src 'self'",
  scriptSrcDirective,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Vercel Analytics beacon endpoint
  "connect-src 'self' https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
