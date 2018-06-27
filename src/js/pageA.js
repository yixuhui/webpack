import 'style/index.scss';


// 懒加载
require.ensure(['lodash'], function () {
  const _ = require('lodash');
  _.split('aaa');
}, 'vendor');

console.log(1);