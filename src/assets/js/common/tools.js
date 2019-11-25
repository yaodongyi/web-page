/*
 * @Author: yaodongyi
 * @Date: 2019-09-04 21:12:15
 * @Description: 全局 tools-API
 */
module.exports = new (class tools {
  constructor() {
    return this;
  }
  /**
   * 根据时间进行节流，防止一定时间内多次触发
   * @param {Function} fn 函数方法
   * @param {Number} delay 时间
   */
  throttle(fn, delay = 1000) {
    var prev = Date.now();
    return function() {
      var context = this,
        args = arguments;
      var now = Date.now();
      if (now - prev > delay) {
        fn.call(context, args);
        prev = Date.now();
      }
    };
  }
  /**
   * 防抖 触发后一定时间内不会再次触发，如果一直运行则一直重置setTimeout 延时操作
   * @param {Function} fn
   * @param {Number} interval 时间
   */
  debounce(fn, interval) {
    var timer;
    var gapTime = interval || 1000;
    return function() {
      clearTimeout(timer);
      var context = this,
        args = arguments;
      timer = setTimeout(function() {
        fn.call(context, args);
      }, gapTime);
    };
  }
})();
