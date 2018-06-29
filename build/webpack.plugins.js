const path = require('path');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = isDev => {
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



  return isDev ?
    defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ]) :
    defaultPlugins.concat([
      new ExtractPlugin({
        filename: '[name].min.css'
      })
    ]);
}