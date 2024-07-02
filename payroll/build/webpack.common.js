const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const vueLoaderConfig = require('./vue-loader.config.js')
const utils = require('./utils')

var baseConfig = {
  entry: {
    index: path.resolve('src', 'entry.js')
  },
  output: {
    path: path.resolve('./', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules(?!(\/|\\).*(weex).*)/
      }
    ]
  },
  plugins: [new copyWebpackPlugin(utils.getcopyDirectory('imgs', 'json'))],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  }
}

var webConfig = merge(baseConfig, {
  output: {
    filename: '[name].web.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, 'postcss.config.js')
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.BannerPlugin({
      banner: '// NOTE: for vue2.0 and platform:web only.\n',
      raw: true,
      exclude: 'Vue'
    })
  ]
})

var nativeConfig = merge(baseConfig, {
  output: {
    filename: '[name].weex.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'weex-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" } \n',
      raw: true,
      exclude: 'Vue'
    })
  ]
})

module.exports = [webConfig, nativeConfig]
