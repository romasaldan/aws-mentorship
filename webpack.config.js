const path = require("path");

module.exports = {
  entry: {
    getProductsById: "./src/functions/getProductsById",
    getProductsList: "./src/functions/getProductsList",
  },
  mode: "production",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};
