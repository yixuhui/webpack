module.exports = isDev => {
  return isDev ?  [
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
}