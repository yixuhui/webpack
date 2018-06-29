const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');

const developmentConfig = require('./webpack.dev');
const productionConfig = require('./webpack.prod');

const merge = require('webpack-merge');



const baseConfig = env => {
  const isDev = env === 'development';

  const postCssPlugins = isDev ? [] : [require('postcss-sprites')({
    spritePath: './dist/assests/sprite'
  }), require('autoprefixer')()];

  const styleBaseConfig = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: !isDev,
        minimize: !isDev
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        arser: 'sugarss',
        plugins: postCssPlugins
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: !isDev
      }
    }
  ];

  const styleLoader = env === 'development' ? ['style-loader'].concat(styleBaseConfig) :
    ExtractPlugin.extract({
    fallback: 'style-loader',   // 如果不提取的话用什么处理
    use: styleBaseConfig
  });


  const fileLoader = env === 'development' ? [
      {
        loader: 'file-loader',
        options: {
          name: 'assets/[name]-[hash:8].[ext]'
        }
      }
    ] : [
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
  ];

  const HTMLPluginOptions = {
    template: path.resolve(__dirname, '..', 'src/index.html'),
    minify: {
      collapseInlineTagWhitespace: !isDev
    }
  }


  const defaultPlugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin(HTMLPluginOptions)
  ];



  const plugins = env === 'development' ?
    defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ]) :
    defaultPlugins.concat([
      new ExtractPlugin({
        filename: '[name].min.css'
      })
    ]);

  return {
    mode: process.env.NODE_ENV || 'production',
    target: 'web',
    entry: path.join(__dirname, '..', './src/js/index.js'),
    output: {
      // chunk可以理解为一个块，即entry中对应的入口
      // hash指本次打包的hash值，那么所有输出的hash值都一样
      // chunkhash指本次打包，给每个入口都分配不同的hash值输出
      // 只有当文件内容改变后，chunkhash才会变化
      filename: 'js/bundle.[hash:8].js',
      path: path.join(__dirname, '..', 'dist')

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
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',

        // 下面这两个配置可以是正则，或绝对路径，或 绝对路径[]
        // exclude: /node_modules/,
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      }, {
        test: /\.scss$/,

        // 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
        use: styleLoader,
        include: path.resolve(__dirname, '..', 'src'),
        exclude: path.resolve(__dirname, '..', 'node_modules')
      }, {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: fileLoader
      }, {
        // 在html中加载图片
        test: /\.(htm|html)$/,
        loader: 'html-withimg-loader'
      }]
    },
    plugins
  }
}

module.exports = env => {
  const configType = env === 'development' ? developmentConfig : productionConfig;
  return merge(baseConfig(env), configType);
}


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}