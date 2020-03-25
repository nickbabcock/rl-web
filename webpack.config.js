const path = require("path");
const WorkerPlugin = require("worker-plugin");
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  entry: './dist/index.js',
  node: false,
  plugins: [
    new WorkerPlugin(),
    new AssetsPlugin(),
  ],
  output: {
    filename: "[name].[contenthash].js"
  }
};
