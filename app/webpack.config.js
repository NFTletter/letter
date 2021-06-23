const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/index.js",
    writeLetter: "./src/writeLetter.js",
    writePage: "./src/writePage.js",
    manage: "./src/manage.js",
    read: "./src/read.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "eval-cheap-source-map",
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/index.html", to: "index.html" },
      { from: "./src/write.html", to: "write.html"},
      { from: "./src/writeLetter.html", to: "writeLetter.html"},
      { from: "./src/writePage.html", to: "writePage.html" },
      { from: "./src/read.html", to: "read.html" },
      { from: "./src/manage.html", to: "manage.html" },
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
  node: {
   fs: "empty"
  }
};
