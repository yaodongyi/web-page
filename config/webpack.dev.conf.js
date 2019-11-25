/*
 * @Author: yaodongyi
 * @Date: 2019-08-28 10:52:48
 * @Description: 开发环境配置
 */
let webpackMerge = require('webpack-merge');
let path = require('path');
let webpack = require('webpack');
let chalk = require('chalk'); // 提供多种彩印api
let os = require('os'); // 提供基本的系统操作函数
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); /* 根据 webpack Compiler 打印信息提示 */
let portfinder = require('portfinder'); // 端口查询器
let utils = require('./utils.js'); // 公用工具，信息提示等
let { CleanWebpackPlugin } = require('clean-webpack-plugin'); /* 删除dist */

let WebpackBase = require('./webpack.base.conf'); // 获取公用配置/基础配置
console.log(Object.keys(WebpackBase.entry));

let config = require('./index.js'); /* 运行参数 */

let devWebpackConfig = webpackMerge({
  mode: 'development', // 开发模式
  entry: WebpackBase.entry, // 入口文件
  optimization: WebpackBase.optimization, // 优化：手动配置覆盖默认优化
  watch: true, // 监听文件变化
  // 模块
  module: {
    rules: [...WebpackBase.module.rules], // 规则
  },
  devtool: 'eval-source-map', // 构建使用原始源代码.详解查看:https://webpack.js.org/configuration/devtool/
  /* devServer基础配置 */
  devServer: {
    writeToDisk: true, // 开启动态生成dist
    disableHostCheck: config.dev.disableHostCheck, // 绕过主机检查。
    historyApiFallback: true, // 启用history模式
    compress: true, // 启用gzip压缩
    host: config.dev.host, // 主机
    hot: true, // 热重载
    port: config.dev.port, // 端口
    https: config.dev.https,
    clientLogLevel: config.dev.clientLogLevel, // inline mode 默认为info ，关掉可设置none
    progress: true, // 构建进度
    inline: true, // true(内联模式) false(iframe模式)
    open: config.dev.autoOpenBrowser, // 启用时是否打开浏览器
    // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    overlay: config.dev.errorOverlay
      ? {
          warnings: false,
          errors: true,
        }
      : false,
    stats: 'errors-only', // 精确控制要显示的 bundle 信息
    publicPath: config.dev.publicPath, // 用于确定应该从哪里提供 bundle(依赖包)
    contentBase: [path.join(__dirname, '../src/'), ...WebpackBase.contentBase], // 告诉devServer从哪个目录中提供内容
    watchContentBase: true, // 监听热重载(监听contentBase 选项下的文件修改之后，会触发一次完整的页面重载。)
    proxy: config.dev.proxy, // 代理
    quiet: true, // 除了初始启动信息之外的任何内容都不会被打印到控制台
    /**
     * 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。
     * webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
     * watchOptions 为设置 Watch 模式的选项
     * watchOptions 在使用惰性模式时无效。
     */
    watchOptions: {
      poll: 1000,
      // poll: config.dev.poll // 例：1000 每秒检查一次变动
      // aggregateTimeout: config.dev.aggregateTimeout // 例：1000 重新构建前增加延迟1秒
    },
  },
  plugins: [
    new CleanWebpackPlugin(), // 删除dist
    new webpack.HotModuleReplacementPlugin(), // 热更新
    ...WebpackBase.Plugins,
  ],
  /**
   * node
   * @value true：提供 polyfill。
   * @value "mock"：提供 mock 实现预期接口，但功能很少或没有。
   * @value "empty"：提供空对象。
   * @value false: 什么都不提供。
   */
  node: {
    setImmediate: false,
    dgram: 'empty', // 数据报
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port || 8080; // 从config 基础devServer里面拿端口号，或者进程里面拿。
  /**
   * 检查是否有host,没有的话取主机ip为host
   * @param {String} localIp 传入host
   */
  let getIPAdress = function(localIp) {
    if (localIp && localIp != '0.0.0.0') return localIp;
    let localIPAddress = '';
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
      let iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          localIPAddress = alias.address;
        }
      }
    }
    return localIPAddress;
  };
  /**
   * @param err 报错信息
   * @param port 端口号
   * @desc 生成终端打印提示信息，查询端口占用，如果占用则生成新端口+1。
   */
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err); // 提示报错
    } else {
      let getIp = getIPAdress(devWebpackConfig.devServer.host);
      process.env.PORT = port; // 设置进程端口号
      devWebpackConfig.devServer.port = port; // 设置devServer端口号
      devWebpackConfig.devServer.host = config.dev.host === '0.0.0.0' ? '0.0.0.0' : getIp; // 获取host
      // 设置提示配置
      let Network = `${config.dev.https ? 'https' : 'http'}://${(config.dev.host === '0.0.0.0' && getIp) || getIp}:${port}`;
      let Local = `${config.dev.https ? 'https' : 'http'}://${config.dev.host === 'localhost' ? '127.0.0.1' : 'localhost'}:${port}`;
      /* webpack(devWebpackConfig, (err, stats) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${(stats.endTime - stats.startTime) / 1000}s`);
        }
      }); */
      devWebpackConfig.plugins.push(
        /**
         * @class FriendlyErrorsWebpackPlugin as FriendlyErrorsPlugin 提供了五种属性
         * @property {Object} compilationSuccessInfo 编译成功提示
         * @property {Function} onErrors 报错提示
         * @property {Boolean} shouldClearConsole 默认清除终端运行信息
         * 以下两种格式化转换器
         * @property {Array} formatters
         * @property {Array} transformers
         * @desc 使用 compiler.hooks.done.tap(plugin, stats => { ... } 构建完成输出信息
         * @desc vue-cli2使用的plugin，cli3 重新封装 webpack Compiler 在cli-service
         */
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`App running at: \n    - Local:  ${chalk.blueBright(Local)}\n    - Network ${chalk.blueBright(Network)}`],
            notes: [`To create a production build, run ${chalk.cyan('npm run build')}.`],
          },
          shouldClearConsole: true,
          onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined, // 是否提供错误信息。
        })
      );
      resolve(devWebpackConfig);
    }
  });
});
