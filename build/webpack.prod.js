const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const Happypack = require("happypack");
const common = require("./webpack.common.js");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const smp = new SpeedMeasurePlugin();

const config = merge(common, {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "Happypack/loader?id=js",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Happypack({
      id: "js",
      use: ["babel-loader?cacheDirectory=true"],
    }),
    new BundleAnalyzerPlugin(),
  ],
});

module.exports = smp.wrap(config);
