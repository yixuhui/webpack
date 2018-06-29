module.exports = {
  devServer: {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    hot: true,
    historyApiFallback: true
  }
}