/*
 * @Author: yaodongyi
 * @Date: 2019-08-09 18:19:34
 * @Description: postcss使用vw vh 与 rem 共存方式,实现不同倍率设计图同时用px开发。
 */ 
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {
      utf8: false
    },
    autoprefixer: { 
      // browsers: ['last 30 versions', '> 2%', 'Firefox >= 10', 'ie 6-11']
    },
    'postcss-preset-env': {},
    // 'postcss-px-to-viewport-opt': {
    //   viewportWidth: 960, // 设计稿宽度
    //   viewportHeight: 1357, // 设计稿高度，可以不指定
    //   unitPrecision: 3, // px to vw无法整除时，保留几位小数
    //   viewportUnit: 'vw', // 转换成vw单位
    //   selectorBlackList: ['vant'], // 不转换的类名
    //   minPixelValue: 1, // 小于1px不转换
    //   mediaQuery: false, // 允许媒体查询中转换
    //   exclude: /(\/|\\)(node_modules)(\/|\\)/ // 排除node_modules文件中第三方css文件
    // },
    'postcss-pxtorem': {
      rootValue: 16, 
      propList: ['*']
    },
    cssnano: {
      preset: 'advanced',
      autoprefixer: true, // 和cssnext同样具有autoprefixer，保留一个
      'postcss-zindex': false
    }
  }
};
