/*
 * @Author: yaodongyi
 * @Date: 2019-09-02 12:54:49
 * @Description:
 */
let meth = new (class {
  constructor() {}
  /**
   * 生成随机数
   * @param {Num} len 需要生成的随机数长度
   */
  random_string(len) {
    //获取随机名
    len = len || 32;
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
    let maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
  /**
   * 生成随机req_msg_id === 随机数+时间戳
   * @param {Num} len 需要生成的随机数长度
   */
  randomSign(len) {
    return this.random_string(len) + '-' + new Date().getTime();
  }
})();
module.exports = meth;
