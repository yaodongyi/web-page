/*
 * @Author: yaodongyi
 * @Date: 2019-08-28 10:52:48
 * @Description: BASE_URL设置
 */

'use strict';
const merge = require('webpack-merge');
let BASE_URL = '';
const ENV = process.env.WEBPACK_ENV;

// console.log(ENV);
switch (ENV) {
  case 'dev':
    BASE_URL = 'https://www.easy-mock.com/mock/5ccec7de7ffbe958f9bc418b';
    break;
  case 'build':
    BASE_URL = 'https://www.easy-mock.com/mock/5ccec7de7ffbe958f9bc418b';
    break;
}

module.exports = merge({
  NODE_ENV: process.env.WEBPACK_ENV === 'dev' ? '"development"' : '"production"',
  BASE_URL: '"' + BASE_URL + '"'
});
