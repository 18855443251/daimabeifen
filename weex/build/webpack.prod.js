const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const configs = require('./webpack.common.js');

let nativeConig = configs[1];
let baseConfig1 = {
  mode: 'development'
};
let baseConfig2 = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          output: {
            beautify: false, //不需要格式化
            comments: /{ "framework": "Vue" }/ //保留正则注释
          },
          compress: {
            //根据需求自由配置
            drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
            collapse_vars: true, // 内嵌定义了但是只用到一次的变量
            reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
          },
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          mangle: true
        }
      })
    ]
  }
};

nativeConig1 = merge(nativeConig, baseConfig1);
nativeConig2 = merge(nativeConig, baseConfig2);

module.exports = (env, argv) => {
  if (argv.mode == 'development') {
    return nativeConig1;
  } else {
    return nativeConig2;
  }
};
