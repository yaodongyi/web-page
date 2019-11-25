/*
 * @Author: yaodongyi
 * @Date: 2019-05-05 23:13:37
 * @Description:vh、vw、rem究极适配方案 详解查看:https://blog.csdn.net/qq_40146880/article/details/98057328
 */

// 设置 vw vh 引入对应 hacks
// const hacks = require('../../plugins/viewport-units-buggyfill.hacks');
// require('../../plugins/viewport-units-buggyfill').init({
//   hacks: hacks
// });

/**
 * @desc rem按设计图设置 --- 版心式布局
 */
const baseSize = 18; // 设计图等比字体大小
const ui_width = 1920; // 设计图宽度
const min_width = 1280; // 屏幕最小宽度，小于此宽度则不再缩放
// 设置 rem 函数
function setRem() {
  const scale = document.documentElement.clientWidth > min_width ? document.documentElement.clientWidth / ui_width : min_width / ui_width;
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px';
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem();
};

// 常规设置
// const baseSize = 8;
// // 设置 rem 函数
// function setRem() {
//   // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
//   const scale = document.documentElement.clientWidth / 375;
//   // 设置页面根节点字体大小
//   document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px';
// }
// // 初始化
// setRem();
// // 改变窗口大小时重新设置 rem
// window.onresize = function() {
//   setRem();
// };
