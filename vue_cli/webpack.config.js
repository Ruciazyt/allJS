// commonjs的导入，导出语法
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // 四个部分
  entry: "./src/main.js",
  output: {
    // path为绝对路径,dirname是node变量，是当前目录所在文件夹
    // 为什么需要path.resolve，为了同一windows和linux环境下路径斜杠问题
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  // module是个数组，每个元素是个对象，对象有test, use两个属性
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      {
        test: /\.s[ca]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      { test: /\.(jpe?g|png|svg|gif|webp)$/, type: "asset/resource" },
      //{ test: /\.(jpe?g|png|svg|gif|webp)$/, use: {loader: "file-loader", options: {esModule: false}}, },
    ],
  },
  // 每个插件元素都是插件的一个构造实例
  plugins: [new VueLoaderPlugin()],
};
