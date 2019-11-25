/*
 * @Author: yaodongyi
 * @Date: 2019-09-02 12:51:43
 * @Description: 设置 ServiceWorker.js 每次更新的版本号
 */
const fs = require('fs');
const package_version = require('../package.json').version; // 取package.json的版本号
const random = require('../src/assets/js/utils/meth.js').randomSign(3); // 取随机数为版本号

let pages = require('../src/pages');
let swList = Object.entries(pages).map(([prop, val]) => {
  return "'" + val.name + "'";
});
// console.log(`---swList--- ${swList}`);

/**
 * @desc fs.readFile 读取文件
 * @param {String} url
 * @param {String} "utf8" 编码
 * @callback (报错信息"error"，文件文本"files")
 * @desc fs.writeFile 写入文件
 * @param {String} url
 * @param {String} result 要写入文件的文本
 * @param {String} "utf8" 编码
 * @callback (报错信息"error")
 */
fs.readFile('./src/service-worker.js', 'utf8', function(err, files) {
  let version = files.match(/let pwa_version = 'version:(\S*?)';/)[1]; // 获取版本号
  var result = files.replace(new RegExp(version, 'g'), random);
  result = swListrewrite(files, result); // 开启则进入就缓存所有页面
  // console.log(result, files);
  fs.writeFile('./src/service-worker.js', result, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
});

// console.log(require("../src/service-worker"))

/**
 * sw缓存列表，缓存所有页面
 * @param {*} files
 * @param {*} result
 * @desc 默认缓存首页，其他进入则缓存。
 */
let swListrewrite = function(files, result) {
  return result.replace(new RegExp(files.match(/swList = \[([\s\S]*?)];/)[1]), swList); // 替换版本号
};
