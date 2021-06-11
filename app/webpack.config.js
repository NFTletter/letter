const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/index.js",
    mint: "./src/mint.js",
    display: "./src/display.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/index.html", to: "index.html" },
      { from: "./src/mint.html", to: "mint.html" },
      { from: "./src/display.html", to: "display.html" },
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
  node: {
   fs: "empty"
  }
};
