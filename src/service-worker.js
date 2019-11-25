/*
 * @Author: yaodongyi
 * @Date: 2019-08-23 15:47:43
 * @Description: service worker
 */
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js'); // workbox
importScripts('./static/js/workbox-sw.js'); // workbox
// 请勿改写以下字段，swList，pwa_version，用于动态更新。
var swList = ['index.html','a.html','b.html','c.html','d.html','e.html','f.html'];
let pwa_version = 'version:YkZ-1574666903290'; // 提交的版本号，用以更新service-worker;
let cacheList = ['/', ...swList]; // 配置需要缓存的列表
/**
 * 每次serviceWorker文件有更新的时候，会先进入install, 然后触发activate, 更新缓存。
 * fetch事件则是请求资源时触发。
 */
// 监听 service worker 的 install 事件
self.addEventListener('install', function(event) {
  // 在事件上接了一个 ExtendableEvent.waitUntil() 方法——这会确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成。
  // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
  event.waitUntil(
    // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
    caches
      .open(pwa_version)
      .then(function(cache) {
        // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
        return cache.addAll(cacheList);
      })
      .then(() => {
        self.skipWaiting(); // 跳过等待
      })
  );
});

// 我们可以在 install 的时候进行静态资源缓存，也可以通过 fetch 事件处理回调来代理页面请求从而实现动态资源缓存。
// 两种方式可以比较一下：
// on install 的优点是第二次访问即可离线，缺点是需要将需要缓存的 URL 在编译时插入到脚本中，增加代码量和降低可维护性；
// on fetch 的优点是无需更改编译过程，也不会产生额外的流量，缺点是需要多一次访问才能离线可用。
// 除了静态的页面和文件之外，如果对 Ajax 数据加以适当的缓存可以实现真正的离线可用， 要达到这一步可能需要对既有的 Web App 进行一些重构以分离数据和模板。
self.addEventListener('fetch', function(event) {
  let timer = false;
  // console.log(event)
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        /**
         * 响应类型为 basic，亦即由自身发起的请求
         * 如果是本地静态资源和服务端资源不是同一个域名
         * 可以设置 response.type === basic为匹配规则，设置静态资源直接从serviceWorker取，除非缓存被清除
         * @param {*} staticResource 匹配规则
         * @desc 所有静态资源直接从service-worker取,(注意：如果有动态验证码图片资源需要单独设置规则，或者从服务端取图片url)
         * @returns response 静态资源
         * @desc 这里设置静态直接返回的原因是，减少静态资源多进行一次请求。
         * @desc 并且避免服务器返回缓慢导致静态资源显示缓慢(查看首页，并设置network的网络传输为slow可以直观的看出效果)。
         */
        let staticResource = new RegExp(/.(js|css|png|jpe?g|gif|svg|htm|html|ico)/, 'g').test(response.url);
        if (staticResource) {
          return response;
        }
      }
      // 接口数据使用网络优先原则，以防数据不更新。对应workbox的NetworkFirst缓存策略。
      var request = event.request.clone(); // 把原始请求拷过来
      return fetch(request)
        .then(function(httpRes) {
          console.log('timer', timer);
          // http请求的返回已被抓到，可以处置了。
          // 请求失败了，直接返回失败的结果就好了。。
          // console.log(httpRes.url, new RegExp(/.(js|css|png|jpe?g|gif|svg|htm|html|ico)/, 'g').test(httpRes.url));
          if (!httpRes || httpRes.status !== 200) {
            return httpRes; // 有一个缺陷，会一直等到到response返回。解决方案为:设置请求超时时间。
          }
          // 请求成功的话，将请求缓存起来。
          var responseClone = httpRes.clone();
          caches.open(pwa_version).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          // console.log('httpRes:', httpRes);
          return httpRes;
        })
        .catch(err => {
          // 如果 Service Worker 有自己的返回，就直接返回
          if (response) {
            console.log(`%c 请求服务器失败，使用缓存数据 ${response.url}`, 'color:#260005;');
            return response;
          } else {
            console.log(err);
          }
        });
    })
  );
});

// self.addEventListener('message', event => {
//   console.log(event);
//   if (event.data === 'skipWaiting') {
//     self.skipWaiting();
//   }
// });

// 通信
self.addEventListener('message', function(e) {
  const promise = self.clients.matchAll().then(function(clients) {
    let senderId = e.source ? e.source.id : 'unknow';
    clients.forEach(client => {
      // console.log(clients);
      client.postMessage({
        client: senderId,
        message: e.data
      });
    });
  });
  e.waitUntil(promise);
});

/**
 * 当serviceWorker被激活时触发
 * @callback 缓存管理
 * @desc active事件中通常做一些过期资源释放的工作
 */
self.addEventListener('activate', function(event) {
  //   console.log(event);
  event.waitUntil(
    Promise.all([
      // 更新客户端
      self.clients.claim(),
      // 清理旧版本
      caches.keys().then(function(cacheList) {
        return Promise.all(
          cacheList.map(function(cacheName) {
            // 判断是否有新版本的serverWorker，有的话删除掉上一次的缓存，使用新缓存
            if (cacheName !== pwa_version) {
              console.log(`缓存已更新, 旧版本：${cacheName}, 新版本：${pwa_version}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
// console.log(pwa_version);
