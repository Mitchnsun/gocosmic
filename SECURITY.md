# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities by opening a private GitHub Security
Advisory or by contacting the maintainer directly. Do not open a public issue.

---

## `enableScripts: true` in `.yarnrc.yml`

### Decision

`enableScripts` is set to `true` and must remain so because several direct and
transitive dependencies require postinstall / install scripts to compile or
download their native binary modules.

### Audited packages that require install scripts

| Package           | Reason                                               |
| ----------------- | ---------------------------------------------------- |
| `esbuild`         | Downloads platform-specific binary via `postinstall` |
| `sharp`           | Compiles / downloads `libvips` native bindings       |
| `lightningcss`    | Downloads platform-specific native binary            |
| `rollup`          | Loads optional native parser via `postinstall`       |
| `@swc/core`       | Downloads platform-specific native binary            |
| `@parcel/watcher` | Compiles native file-system watcher                  |

### Mitigation

- All dependencies are locked via `yarn.lock`; hashes are verified on install.
- The dependency tree is reviewed on every `yarn upgrade` or PR that touches
  `package.json`.
- Run `yarn audit` regularly and address high/critical advisories promptly.

### Re-evaluating this setting

If all packages in the table above are replaced by pure-JS alternatives in the
future, set `enableScripts: false` in `.yarnrc.yml` and remove this section.

---

## Security Best Practices for Development

This section documents the security constraints and patterns that must be
respected when adding features to this project.

---

### HTTP Security Headers

**Current state:** `next.config.ts` defines security headers for every route:
`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, and `Permissions-Policy`.

The CSP keeps `eval()` disabled in production. In development only,
`script-src` includes `'unsafe-eval'` because React development mode requires
it for debugging features such as reconstructing call stacks.

**Reference configuration:**

```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Content-Security-Policy',
          // Adjust script-src if you add third-party scripts.
          // unsafe-inline is required for Next.js inline styles.
          value: [
            "default-src 'self'",
            process.env.NODE_ENV === 'development'
              ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com"
              : "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "connect-src 'self' https://vitals.vercel-insights.com",
            "frame-ancestors 'none'",
          ].join('; '),
        },
      ],
    },
  ];
},
```

> **Note on Vercel:** Vercel injects `X-Content-Type-Options: nosniff` and
> `X-Frame-Options: SAMEORIGIN` automatically on all deployments. HSTS
> (`Strict-Transport-Security`) is only added on Vercel Enterprise or when
> configured via a custom domain with automatic HTTPS. The CSP, Referrer-Policy,
> and Permissions-Policy headers are **never** added by Vercel automatically —
> they must be defined in the application.

---

### API Routes

This project exposes one public API route: `app/api/contact/route.ts`, which
receives contact form submissions. Its protections are:

1. **Same-origin check** — requests carrying an `Origin` header from another
   host are rejected with `403`. Custom route handlers get no CSRF protection
   from Next.js, unlike server actions.
2. **Body size cap** — the body is read through `lib/contact/body.ts`, which
   counts the bytes as they arrive and cancels the stream past 20 kB (`413`)
   before anything is parsed. `Content-Length` is never trusted: a client can
   omit it or use chunked transfer encoding.
3. **Input validation** — every field is coerced to a string, truncated, then
   validated by `lib/contact/validation.ts` (shared with the client form).
   Invalid payloads return `400` with the per-field error codes.
4. **Honeypot** — a hidden `honeypot` field; a filled one is answered `200`
   without delivery so bots cannot detect the filter.
5. **Rate limiting** — three submissions per client IP per hour
   (`lib/contact/rateLimit.ts`). Keys whose attempts have all aged out are
   swept at most once per window, so the map does not grow with one-time IPs.

   **Known limitation:** the counters live in the process memory of a single
   instance. On a serverless or horizontally scaled deployment each instance
   keeps its own counters and a cold start clears them, so a determined caller
   can exceed three messages per hour by reaching several instances — each
   accepted message costs a Resend delivery. Closing this needs a shared
   atomic TTL store (Vercel KV, `@upstash/ratelimit`) and the credentials that
   go with it; until one is provisioned, treat the limit as protection against
   casual abuse, not as a hard quota.

6. **Delivery** — forwarded through Resend when `RESEND_API_KEY`,
   `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set. In production a missing
   variable is an error: the route logs it and answers `502` rather than
   telling the visitor a message was sent that nobody will read. Outside
   production the whole submission is written to the server log and accepted,
   so the form can be exercised without a provider. The route never echoes the
   submitted content back to the client.

The endpoint is unauthenticated by design (public marketing form) and performs
no mutation beyond sending that email.

If further API routes are added, the following must be checked before merging:

1. **Input validation** — Validate and sanitize all request body and query
   parameters. Use `zod` or similar for schema validation.
2. **Authentication** — Protect mutation endpoints (POST/PUT/PATCH/DELETE) with
   session or token verification. Never rely on client-side checks alone.
3. **CSRF** — For state-changing routes callable by a browser, verify the
   `Origin` header or use a CSRF token. Next.js server actions have built-in
   CSRF protection; custom route handlers do not.
4. **CORS** — Only allow origins that need access. Do not set
   `Access-Control-Allow-Origin: *` on authenticated endpoints.
5. **Rate limiting** — Add rate limiting (e.g., Vercel Edge or
   `@upstash/ratelimit`) on any publicly accessible endpoint.

---

### Server Actions

The project has one `"use server"` action, `app/actions/free-mockup.ts`, which
emails a free mockup request to the studio. Rules for it and for any action
added later:

- They are CSRF-protected by Next.js (same-origin enforcement on the
  `Content-Type` header).
- They run with full server privileges — never expose admin operations from
  server actions accessible to unauthenticated users.
- Validate all inputs with a schema (zod) — do not trust `FormData` values.
  The free mockup payload is validated by `lib/validation/free-mockup.schema.ts`
  server-side; the identical client-side check is a UX shortcut, never the
  security boundary.
- Escape visitor input before interpolating it into an HTML email body (see
  `lib/free-mockup-email.ts`).
- The free mockup form carries an invisible honeypot field; a filled honeypot
  is dropped silently. Rate limiting (Upstash, Vercel WAF) remains a future
  improvement.

---

### Environment Variables

- **Never** commit `.env` or `.env.local` files.
- **Never** prefix server-only secrets with `NEXT_PUBLIC_` — doing so exposes
  them in the client bundle.
- All `NEXT_PUBLIC_*` variables are embedded at build time and visible to
  anyone who downloads the page. Only put non-sensitive configuration there
  (e.g., analytics IDs, public API base URLs).
- Maintain a `.env.example` documenting required variables without their values.

---

### Translations and Dynamic Imports

The `i18n/request.ts` file dynamically imports translation files:

```ts
await import(`../messages/${locale}/${namespace}.json`);
```

**This is safe because:**

- `locale` is validated against a whitelist (`hasLocale(routing.locales, ...)`).
- `namespace` values are hardcoded strings produced by `getNamespacesForPath()`,
  not derived from user input.

If this pattern is ever extended (e.g., to load user-supplied keys), add
explicit allowlist validation before the import path is constructed.

---

### Third-Party Scripts

Any new third-party script inclusion must:

1. Be added to the `script-src` directive in the CSP (once configured).
2. Be evaluated for data collection scope (GDPR relevance).
3. Be loaded via `next/script` with `strategy="lazyOnload"` or
   `strategy="afterInteractive"` — never use a raw `<script>` tag.

Current third-party scripts: Vercel Analytics (`@vercel/analytics/next`).

---

### Dependency Management

- Run `yarn audit` before every release; resolve HIGH and CRITICAL advisories.
- Pin exact versions for packages with native binaries (Three.js, React Three
  Fiber) to avoid unexpected binary downloads on CI.
- The `resolutions` field in `package.json` is used to force a patched version
  of a transitive dependency — document the reason when adding an entry.
- The checked-in Yarn binary (`.yarn/releases/yarn-*.cjs`) is the only trusted
  Yarn binary for this project. Do not install a global Yarn version that
  overrides it.

---

### Clickjacking

`X-Frame-Options: DENY` (or `frame-ancestors 'none'` in CSP) must be set if the
site should never be embedded in an iframe. Until security headers are configured
(see above), the site is theoretically embeddable — acceptable for a public
marketing site with no auth, but should be addressed.

---

### Middleware (`proxy.ts`)

In Next.js 16, the middleware entry point is `proxy.ts` at the project root
(the `middleware.ts` naming is deprecated). The file implements locale routing
via `next-intl` and injects the `x-pathname` header consumed by
`i18n/request.ts`. No action required — the current naming is correct.
