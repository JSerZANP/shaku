const CopyPlugin = require("copy-webpack-plugin");
const path = require('path')

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  experimental: {
    appDir: true
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
