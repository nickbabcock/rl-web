const path = require("path");
const WorkerPlugin = require("worker-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WorkerPlugin(),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new WasmPackPlugin({ crateDirectory: path.resolve(__dirname, "crate") })
  ],
  output: {
    filename: "[name].[contenthash].js"
  }
};
