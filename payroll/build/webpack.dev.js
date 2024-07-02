const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var configs = require('./webpack.common.js');

var webConfig = configs[0];

module.exports = merge(webConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        removeAttributeQuotes: false
      },
      hash: true,
      template: './index.html'
    })
  ],
  devServer: {
    //设置基本目录结构
    contentBase: [path.resolve(__dirname, '../')],
    //服务器的IP地址，可以使用IP也可以使用localhost
    host: '0.0.0.0',
    //服务端压缩是否开启
    compress: true,
    //配置服务端口号
    port: '1339',
    proxy: {
      '/eweb': {
        target: 'http://10.1.33.18:9088',
        // target: 'http://222.92.218.136:9999',
        // secure:false,//如果是https接口需要配置这个参数
        changeOrigin: true //如果接口跨域，需要配置这个参数
        // pathRewrite:{
        // '^/refacmob':''
        // }
      }
    }
  }
});
