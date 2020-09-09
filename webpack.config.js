const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  /** 以我们的src的index.js 作为入口进行打包 */
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map', // 可以产生source-map
  /** 先找source 再找node_modules */
  resolve: {
    modules: [path.resolve(__dirname, 'source'), path.resolve('node_modules')]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
}
