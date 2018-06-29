const ExtractPlugin = require('extract-text-webpack-plugin');

module.exports = isDev => {
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

   return isDev ? ['style-loader'].concat(styleBaseConfig) :
    ExtractPlugin.extract({
      fallback: 'style-loader',
      use: styleBaseConfig
    });
}

