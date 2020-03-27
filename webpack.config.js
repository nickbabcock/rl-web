const path = require("path");
const WorkerPlugin = require("worker-plugin");
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  entry: './dist/index.js',
  node: false,
  plugins: [
    new WorkerPlugin(),
    new AssetsPlugin({filename: 'data/webpack.json'}),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "static", "js"),
    publicPath: "/js/",
  }
};
