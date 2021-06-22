const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/index.js",
    createLetter: "./src/createLetter.js",
    mintPage: "./src/mintPage.js",
    manage: "./src/manage.js",
    display: "./src/display.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "eval-cheap-source-map",
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/index.html", to: "index.html" },
      { from: "./src/create.html", to: "create.html"},
      { from: "./src/createLetter.html", to: "createLetter.html"},
      { from: "./src/mintPage.html", to: "mintPage.html" },
      { from: "./src/display.html", to: "display.html" },
      { from: "./src/manage.html", to: "manage.html" },
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
  node: {
   fs: "empty"
  }
};
