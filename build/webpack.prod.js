module.exports = {
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  }
}


// optimization: {
//   splitChunks: {
//     name: 'common',     // 打包公共代码的文件名
//       minChunks: 2        // 出现两次以上就打包
//   }
// }