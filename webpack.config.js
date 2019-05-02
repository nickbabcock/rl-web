const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "postcss-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".wasm"]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html"
    }),

    new WasmPackPlugin({ crateDirectory: path.resolve(__dirname, "crate") })
  ]
};
