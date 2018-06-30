const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const baseConfig = {
  entry: {
    react: ['react']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].js'
  },

  // 打包公共代码
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',

      // 下面这两个配置可以是正则，或绝对路径，或 绝对路径[]
      // exclude: /node_modules/,
      include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules/webpack-dev-server/client')]
    }, {
      test: /\.scss$/,

      // 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
      use: ExtractPlugin.extract({
        fallback: 'style-loader',   // 如果不提取的话用什么处理
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }]
      }),
      include: path.resolve(__dirname, 'src')
    }, {
      test: /\.(gif|jpg|jpeg|png|svg)$/,
      use: [
        /*  {
         loader: 'file-loader',
         options: {
         name: 'assets/[name]-[hash:8].[ext]'
         }
         },*/
        {
          loader: 'url-loader',
          options: {
            // 当url指向的文件<10240b, 就把url进行base64编码，否则丢给file-loader处理
            limit: 10240,
            // 静态资源生成的文件目录,与原目录路径统一，但是不会进行编码了
            name: '[path]/[name]-[hash:8].[ext]'
          }
        },
        'image-webpack-loader' // 压缩图片
      ]
    }, {
      // 在html中加载图片
      test: /\.(htm|html)$/,
      loader: 'html-withimg-loader'
    }]
  },
  plugins: [
    new ExtractPlugin({
      filename: 'css/[name]-[hash:8].min.css'
    })
  ]
}


const pages = [
  generatPage({
    title: 'page A',
    entry: {
      a: './src/pages/a'
    },
    filename: 'a',
    chunks: ['react', 'a']
  }),
  generatPage({
    title: 'page B',
    entry: {
      b: './src/pages/b'
    },
    filename: 'b',
    chunks: ['react', 'b']
  }),
  generatPage({
    title: 'page C',
    entry: {
      c: './src/pages/c'
    },
    filename: 'c',
    chunks: ['react', 'c']
  })
]



function generatPage ({
                        title = '',
                        entry = '',
                        template = './src/index.html',
                        filename = '',
                        chunks = []
                      } = {}) {
  return {
    entry,
    plugins: [
      new HTMLPlugin({
        title,
        chunks,
        template,
        filename: filename + '.html'
      })
    ]
  }
}


// 暴露为多页面多配置
// module.exports = pages.map(page => merge(baseConfig, page));

// 也可以暴露为单配置
module.exports = merge([baseConfig].concat(pages));