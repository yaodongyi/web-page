/*
 * @Author: yaodongyi
 * @Date: 2019-08-30 17:36:27
 * @Description: 弹出框
 */
import './style.less';
export default new (class Toast {
  constructor() {
    this.str = `
    <div id="_Toast">
      <div class="t-mask"></div>
      <div class="t-main">
        <div>您浏览的网站有更新!</div>
        <button>立即更新</button>
      </div>
    </div>`;
  }
  show() {
    return new Promise((resolve, reject) => {
      $('body').append(this.str);
      $('#_Toast').click(() => {
        this.hide();
        resolve("confirm"); // 如果是取消则reject
      });
    });
  }
  hide() {
    $('#_Toast').remove();
  }
})();
