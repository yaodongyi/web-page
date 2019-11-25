<!--
 * @Author: yaodongyi
 * @Date: 2019-08-28 10:52:48
 * @Description: README.md
 -->
# publicity-page 
 
集成docker打包配置，serviceWorker离线缓存(每次打包自动更新版本号，弹出更新网页提示)，多页面路由配置，postcss根据rem，vwvh转换器配置，补全css前缀，自动加上favicon，多页面html打包，less，webpack常规各种分离代码、压缩、混淆等等～

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### [页面路由配置](./src/pages.js)
```javascript
    // 例:
    /**
     * @param {String} name 路由名
     * @param {String} entry 入口文件
     * @param {Object} meta 用于seo检索的meta，Keywords～
     * @param {String} path 页面路径
     * @desc 每次添加页面都需重启dev，或者重新build。
     */
    {
        name: 'index.html', // 路由名 👉 打开项目首页对应的名字，首页默认index.html，避免入口页缺失(如需修改请对应修改pwa及webpack默认入口设置)
        meta: {
        Keywords: '资讯,新闻,财经,房产,视频,NBA,科技,腾讯网,腾讯,QQ,Tencent'
        },
        entry: component('/index.js'), // 是否添加入口文件(可选)
        path: component('/index.html')
    },
```
>  根据传入的pages路由生成多页面的`webpack`配置自行查看[webpack.base.conf.js](./config/webpack.base.conf.js)

### nginx配置 [详情查看:](./nginx.conf)
```   
    # /web-page/ 为项目的基路径,代理到proxy_pass
    location /web-page/ {
        proxy_pass http://localhost/github-javascript/javascript/publicity-page/dist/; # 放在nginx上的目录
        root   html;
        index  index.html index.htm; 
    }

    # 如果没有https域名则直接用localhost,也就是按照上面的配置即可。
    # 如果有https域名的话，配置443端口，url则为 https://waituntil.online/pwa-vue

    server_name  waituntil.online; # 这里设置了https的域名 如果没有则使用初始值
    # server_name  127.0.0.1; 

    listen 443 ssl;
    ssl_certificate      ssl/*******_waituntil.online.pem; # 域名的pem 放在nginx下的ssl目录
    ssl_certificate_key  ssl/*******_waituntil.online.key; # 域名的key 放在nginx下的ssl目录
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
```

### [附上vh、vw、rem究极适配方案](./postcss.config.js)
```
详情查看:https://blog.csdn.net/qq_40146880/article/details/98057328
```

### serviceWorker(离线缓存) 主要查看以下文件
>  service-worker.js sw配置文件    
>  registerServiceWorker.js sw注册文件    
>  manifest.json sw清单    
>  config/sw-version 打包动态更新`version`。     
>  文件都有注释，此处使用的sw设置了: 接口`NetworkFirst`，静态文件`CacheOnly`的缓存策略。

### Webpack
>  webapack.config.js为webpack运行基础文件    
>  对于webpack就不赘述了，文件注释很完整。想了解的可以跟着目录及注释走一波。    

以下是目录结构，本脚手架侧重点在于想要做`seo`又不想用或不会用`服务端渲染`，那么可以尝试了解一下，降低开发成本的同时提高项目逼格(总体质量)。

### 目录结构

```javascript
├── webpack.config.js ---------------- webpack基础运行文件
│
├── config ---------------------- [webpack配置]("./config")
│    ├── api.env.js ------------- 开发/生成环境api接口，根据环境切换
│    ├── sw-version.js ---------- service-worker 每次打包时自动更新版本号配置
│    ├── webpack.base.conf ------ webpack公用配置
│    ├── webpack.dev.conf ------- webpack开发配置
│    ├── webpack.prod.conf ------ webpack生产环境配置
│    └── index.js --------------- 开发环境基础配置
│
├── docker -------------------------- dockerfile文件
├── build.sh ------------------------ docker shell文件
├── docker-compose.yml -------------- dockerfile文件
├── docker这块没有用docker打包的无需在意(直接忽略)
│
├── package.json ---------------- 项目package.json
├── dist ------------------------ 打包后代码
├── static ---------------------- 静态文件 
│    ├── images
│    └── js .....
│ 
├── src ------------------------------ 源码目录
│   ├── assets ----------------------- 资源目录
│   ├── plugins ---------------------- 公共插件
│   │    └──Toast -------------------- 弹出框(此处引入为serviceWorker更新弹窗)
│   │
│   ├── pages ------------------------ 页面目录
│   │    ├──index.html --------------- html文件(默认首页)
│   │    └──index.js ----------------- js文件(默认首页js入口文件)
│   │
│   ├─── js -------------------- 公用方法
│   │    ├── common ------------ 项目公用方法(放置全局引入方法)
│   │    │   ├── axios --------- axios拦截器
│   │    │   ├── methods ------- 注入全局 $web(methods-API)
│   │    │   ├── navigator ----- 判断终端及浏览器内核
│   │    │   └── rem ----------- 项目全局引入的rem转化器
│   │    │ 
│   │    └── utils  ------------ js组件(放置按需引入方法)
│   │
│   ├── pages.js ----------------------- 页面路由文件(改删增页面时，需重启项目)
│   │    └── page首页name，固定命名index(如需修改请对应修改pwa及webpack默认入口设置) 
│   │
│   ├── registerServiceWorker.js -------------- 离线缓存注册文件
│   ├── service-worker.js --------------------- 离线缓存
│   ├── manifest.json ------------------------- 离线缓存注册清单
│   └── ******
│   
├── nginx.conf ----------------------- nginx配置文件
├── .babelrc ------------------------- babel配置文件
├── postcss.config.js ---------------- postcss配置文件
└── README.md 
```

# 环境配置
`api.env.js`
```javascript
switch (ENV) {
  case 'dev':
    BASE_URL = 'http://development' /* 开发模式 */;
    break;
  case 'build':
    BASE_URL = 'http://production' /* 生产模式 */;
    break;
}
```

# 路由API调用方式 
[示例: `a/index.html`](src/pages/a/index.html)
```javascript
    // 例:
    $web.router({
        path: 'b.html',
        query: { id: 1 }  // 这里query传值使用了localStorage
    });
    // $web 为全局注入方法，("./src/assets/js/common/methods.js)，如需为$web添加方法，可前往methods.js添加
    // 注意: 对于pwa应用尽量不要使用url传值，如果需要进行url传值，请自行配置对应规则。

    // or

    <a href="b.html">a</a>
```

# $tools 全局 tools-API
[示例: `tools.js`](src/assets/js/common/tools.js)    
使用方式: `$tools.methods()`
```javascript
// 例：
function scrpllFun(){
    console.log(1);
}
$(document).scroll($tools.debounce(scrollFun, 30));
```

