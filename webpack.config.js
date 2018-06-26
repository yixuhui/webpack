const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: path.join(__dirname, 'src/js/index.js'),
  output: {
    // chunk可以理解为一个块，即entry中对应的入口
    // hash指本次打包的hash值，那么所有输出的hash值都一样
    // chunkhash指本次打包，给每个入口都分配不同的hash值输出
    // 只有当文件内容改变后，chunkhash才会变化
    filename: 'js/bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')

    // 默认情况资源文件的请求都会引用相对路径，比如：<script src="js/aaa.js"></script>
    // 如果设置了publicPath: 'http://cdn.com', 就会变成<script src="http://cdn.com/js/aaa.js"></script>
    // 一般用于上线后，有自己的cdn
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
      '@': resolve('src'),
      'style': resolve('src/style'),
      'js': resolve('src/js')
    }
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    // hot: true,
    historyApiFallback: {
      index: '/src/index.html'
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',

      // 下面这两个配置可以是正则，或绝对路径，或 绝对路径[]
      // exclude: /node_modules/,
      include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
    }, {
      test: /\.scss$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          minimize: true
        }
      },
        'postcss-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }],
      include: path.resolve(__dirname, 'src'),
      exclude: path.resolve(__dirname, 'node_modules')
    }, {
      test: /\.(gif|jpg|jpeg|png|svg)$/,
      use: [
      /*  {
          loader: 'file-loader',
          options: {
            name: 'assets/[name]-[hash:8].[ext]'
          }
        },*/
        'image-webpack-loader', // 压缩图片
        {
          loader: 'url-loader',
          options: {
            // 当url指向的文件<10240b, 就把url进行base64编码，否则丢给file-loader处理
            limit: 10240,
            // 静态资源生成的文件目录,与原目录路径统一，但是不会进行编码了
            name: '[path]/[name]-[hash:8].[ext]'
          }
        }
      ]
    }, {
      // 在html中加载图片
      test: /\.(htm|html)$/,
      loader: 'html-withimg-loader'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin({
      // template: path.join(__dirname, 'src/index.html')
      // 默认就是当前根目录，依据context配置项
      template: 'src/index.html',

      // 文件名默认和template一样，当然可以自定义
      filename: 'index.html',

      // 压缩配置 https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        collapseInlineTagWhitespace: true       // 删空格
      }

      // 缓存文件默认true  cache: true


      // 所有的javascript脚本默认添加在body标签最后面，可以通过inject: 'head'改变
    })
  ]
}

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}