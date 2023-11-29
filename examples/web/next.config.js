const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
    appDir: true,
  },

  // https://github.com/shikijs/shiki/issues/22
  webpack: (config, options) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(path.dirname(require.resolve("shiki")), ".."),
            to: "static/shiki/",
          },
        ],
      })
    );
    return config;
  },
};

module.exports = withMDX(nextConfig);
// module.exports = nextConfig;
