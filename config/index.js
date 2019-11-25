/*
 * @Author: yaodongyi
 * @Date: 2019-08-28 10:52:48
 * @Description: devServer 基础配置
 */
module.exports = {
  dev: {
    disableHostCheck: true,
    publicPath: '/',
    // 不设置的时候默认host为本机ip
    // host: 'waituntil.online',
    host: '0.0.0.0',
    // host: 'localhost',
    port: 8769,
    https: false,
    clientLogLevel: 'none', // 运行信息 关掉可设置none
    // autoOpenBrowser: 'Google Chrome', // true / false / Google Chrome
    errorOverlay: true, // 开启浏览器全屏覆盖报错
    notifyOnErrors: true, // 开启自定义控制台报错信息
    // 对于代理不了解的，查看: https://github.com/chimurai/http-proxy-middleware
    proxy: {
      '/api': {
        target: 'https://www.easy-mock.com/mock/5ccec7de7ffbe958f9bc418b', // 后台接口域名
        changOrigin: true, // 将主机标头的原点更改为目标URL,解决跨域
        ws: true, // proxy websockets
        secure: false, // 设置支持https协议的代理,不检查安全问题
        pathRewrite: {
          '^/api': '/' // 重写
        }
      }
    }
  }
};
