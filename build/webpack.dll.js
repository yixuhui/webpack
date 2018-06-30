/**
 * 专门用于打包第三方依赖比如element-ui
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vue: ['vue', 'vuex'],
    ui: ['element-ui']
  },
  output: {
    // 一般第三方依赖打包一次就行了
    // 所以就不放在dist里面了，因为dist会被删除
    path: path.join(__dirname, '../src/dll'),
    filename: '[name].dll.js',
    library: '[name]'   // 暴露出 (也叫做放入全局域) dll 函数
  },
  plugins: [
    new webpack.DllPlugin({
      // 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的
      path: path.join(__dirname, '../src/dll', '[name]-manifest.json'),
      name: "[name]"
    })
  ]
}