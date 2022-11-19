/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ["./src", "./tests"],
  },
  webpack: (config) => {
    config.experiments.asyncWebAssembly = true;
    config.output.assetModuleFilename = `static/[hash][ext]`;
    config.output.publicPath = `/_next/`;
    config.module.rules.push({
      test: /\.(wasm|replay)$/,
      resourceQuery: {
        not: /module/
      },
      type: "asset/resource",
    });
    return config;
  }
}
