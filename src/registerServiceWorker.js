/*
 * @Author: yaodongyi
 * @Date: 2019-08-29 18:31:26
 * @Description:
 */
import Toast from './plugins/Toast/Toast.js';
// production 使用pwa
if (process.env.NODE_ENV === 'production') {
  if (navigator.serviceWorker != null) {
    navigator.serviceWorker.register('./service-worker.js').then(function(registartion) {
      console.log('浏览器支持service-worker:', registartion.scope);
    });
    if (navigator.serviceWorker.controller) {
      // navigator.serviceWorker.controller.postMessage('message'); // 通信 向sw发送信息
    }
    navigator.serviceWorker.addEventListener('message', function(e) {
      console.log('message:', e); // 通信 接收sw传出来的信息
    });
  }

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', registartion => {
    if (refreshing) {
      return;
    }
    refreshing = true;
    // 防止一直刷新
    Toast.show().then(res => {
      window.location.reload();
    });
  });
}
