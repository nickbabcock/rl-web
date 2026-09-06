const isDev = process.env.NODE_ENV !== "production";

const csp = `
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval' ${isDev ? "'unsafe-eval'" : ""};
  style-src 'self' ${isDev ? "'unsafe-inline'" : ""};
`;

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=8640000",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "Content-Security-Policy",
    value: csp.replace(/\s{2,}/g, " ").trim(),
  },
];

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
