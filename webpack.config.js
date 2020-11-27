const path = require("path");
const AssetsPlugin = require("assets-webpack-plugin");

module.exports = {
  entry: "./dist/index.js",
  devtool: "source-map",
  plugins: [
    new AssetsPlugin({ filename: "data/webpack.json" }),
  ],
  module: {
    rules: [{ test: /\.(wasm)$/i, loader: 'file-loader' }]
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "static", "js"),
    publicPath: "/js/",
  },
};
