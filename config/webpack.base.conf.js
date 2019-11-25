/*
 * @Author: yaodongyi
 * @Date: 2019-09-03 15:57:12
 * @Description: 抽离公共webpack。分别用于prod.conf/dev.conf
 */

let webpack = require('webpack'); /* webpack */
let path = require('path'); /* 获取系统路径 */
let HtmlWebpackPlugin = require('html-webpack-plugin'); /* 打包html资源 */
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); /* 错误提示 */
let ExtractTextPlugin = require('extract-text-webpack-plugin'); /* css分离 */
// let MiniCssExtractPlugin = require('mini-css-extract-plugin'); /* 压缩css */
let UglifyJsPlugin = require('uglifyjs-webpack-plugin'); /* 优化压缩混淆js代码 */

let env = process.env.WEBPACK_ENV === 'build' ? true : false; // 判断 build/server 用以设置hash值
// console.log('---env---', env);

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
/**
 * 全局注入文件，vendor为node_modules抽离文件，其他为entry引入的js文件。
 */
let splitChunks_js = ['vendor', 'reg-sw', 'rem']; // 分离的js文件。用于chunks注入

/* 根据传入的pages路由生成多页面 */
let pages = require('../src/pages'); // pages文件
const ENTRY = Symbol('entry'); // 入口文件
const HTMLWEBPACKPLUGIN = Symbol('HtmlWebpackPlugin'); // page文件
const CONTENTBASE = Symbol('contentBase');
const SWLIST = Symbol('serviceWorker-cacheList');
const PAGES_PLUGIN = new (function() {
  return Object.entries(pages).map(([prop, val]) => {
    let pathSplit = val.path.split('/');
    return {
      /* 有入口文件entry的时候写入[ENTRY] */
      [ENTRY]: new (function() {
        if (!val.entry) return;
        return Object.assign({}, { [val.name.split('.')[0]]: val.entry });
      })(),
      /* 页面文件写入[HTMLWEBPACKPLUGIN] */
      [HTMLWEBPACKPLUGIN]: new (function() {
        return new HtmlWebpackPlugin({
          filename: val.name, // 指定写入的文件
          template: val.path, // 模版路径
          hash: env ? true : false, // 文件hash 根据环境配置
          inject: true, // true/body 插入body底部, head 插入head底部
          // title: '可供seo检索的webpack脚手架', // 此处使用了html-withimg-loader 无法使用title
          meta: val.meta || '', // 注入meta
          // 压缩 默认production为true
          minify: {
            removeComments: true, //清除注释
            collapseWhitespace: true, //清理空格
          },
          favicon: './favicon.ico', // 添加小图标
          chunks: [val.name.split('.')[0], ...splitChunks_js] /* 如果有多个入口文件，则可以配置多个entry,若没有则全部使用index */,
        });
      })(),
      /* 多页面动态更新所需的提供内容目录 */
      [CONTENTBASE]: path.join(__dirname, '.' + val.path.split(pathSplit[pathSplit.length - 1])[0]),
      /* sw cacheList */
      [SWLIST]: val.name,
    };
  });
})();
// console.log(...PAGES_PLUGIN.map(res => res[SWLIST]));
// console.log(...PAGES_PLUGIN.map(res => res[CONTENTBASE]));
// console.log(...PAGES_PLUGIN.map(res => res[HTMLWEBPACKPLUGIN]));
// console.log(...PAGES_PLUGIN.map(res => res[ENTRY]));

// 公用配置
let config = {
  entry: Object.assign(
    {
      // index: './src/pages/index.js', // 默认首页 2019/9/7 下午12:10:18 第二次修改
      'reg-sw': './src/registerServiceWorker.js', // 全局注入serviceWorker
      rem: './src/assets/js/common/rem.js', // 全局多页面注入rem，根元素设置font-size。
    },
    ...PAGES_PLUGIN.map(res => res[ENTRY]) // 多页面入口文件并入
  ),
  contentBase: [...PAGES_PLUGIN.map(res => res[CONTENTBASE])], // devServer 提供内容目录
  swList: [...PAGES_PLUGIN.map(res => res[SWLIST])], // sw 缓存列表
  resolve: {
    extensions: ['.js', '.html', '.json'],
    alias: {}, // 路径重写
  },
  Plugins: [
    new ExtractTextPlugin({
      // css生成link. Extract text from a bundle, or bundles, into a separate file (将包中的文本提取到单独的文件中)。
      filename: env ? 'css/[name]-[chunkHash:3].css' : 'css/[name].css', // 设置文件名
      allChunks: true, // Extract from all additional chunks too (从所有包中提取)。
    }),
    new webpack.DefinePlugin({
      // 编译时添加全局常量
      'process.env': require('./api.env.js'),
    }),
    new webpack.ProvidePlugin({
      //全局注入
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.web': resolve('/src/assets/js/common/methods.js'),
      $web: resolve('/src/assets/js/common/methods.js'),
      $tools: resolve('/src/assets/js/common/tools.js'),
    }),
    ...PAGES_PLUGIN.map(res => res[HTMLWEBPACKPLUGIN]), // 根据传入的pages路由生成多页面
    new FriendlyErrorsPlugin(), // 提示错误插件
  ],
  module: {
    rules: [
      // { //不抽离写法
      //   test: /\.(less|css)$/,
      //   loader: 'style-loader!css-loader!less-loader!postcss-loader'
      // },
      // css,less 压缩抽离
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', // css,less抽离生成style。通过ExtractTextPlugin生成link
          use: ['css-loader', 'postcss-loader', 'less-loader'],
          publicPath: '../', // 设置基路径，pages以路由放置位置为基准。
        }),
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
      },
      {
        test: /\.(htm|html)$/,
        loader: 'html-withimg-loader', // html标签资源打包压缩，例:<img src=""> ....
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader', // html,css引入的img会通过各自的loader经过url-loader进行解析。
            options: {
              limit: 10,
              name: env ? 'img/[name].[hash:7].[ext]' : 'img/[name].[ext]', // 判断环境hash
            },
          },
          {
            loader: 'image-webpack-loader', // 压缩图片(会影响画质)无使用
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      // 压缩混淆js代码,默认最佳压缩。详解查看:https://github.com/webpack-contrib/uglifyjs-webpack-plugin
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false, // 提示信息，好鬼烦的提示。
          parallel: true, // 启用多进程并行运行
          ie8: true,
          // 这里为ie做了处理(关键字define、default等, 缺少标识符、字符串或数字～)
          // 本来做了兼容ie8，但因为无法很好的处理addEventListener,以及flex布局,我拒绝兼容ie8。(有需要的自行做处理)
        },
      }),
    ],
    // 分包 详解查看:https://webpack.js.org/plugins/split-chunks-plugin/
    splitChunks: {
      chunks: 'all', // (all、async、initial)默认配置为async异步共享js依赖
      minSize: 30000, // 要生成的块的最小大小（以字节为单位）
      minChunks: 1, // 分割最少共享依赖数
      maxAsyncRequests: 5, // 按需加载时的最大并行请求数
      maxInitialRequests: 3, // 入口点处的最大并行请求数
      automaticNameDelimiter: '~',
      name: true, // true自动获取分割的js名称
      // 分包抽离规则。
      cacheGroups: {
        // 抽取node_modules公共包
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendor',
          priority: -10,
        },
        // 抽离默认依赖，例:index.js 入口文件
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
console.log('run webpack.base.conf.js...');
// console.log(...config.Plugins);
module.exports = config;
