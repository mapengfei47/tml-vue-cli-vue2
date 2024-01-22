# VUECLI_VUE2_JS

vuecli脚手架，vue2+js+公共模板，静态资源cos上传

## 使用说明

首先查看npm源，是否为公司地址，cnpm也同理。 npm config get registry

不是需要手动设置： npm config set registry http://111.230.199.61:6888/

然后安装依赖： npm i

启动项目：npm run dev

## package配置说明

build:dev  开发环境编译

build:test 测试环境编译

build:pro  现网环境编译

build:analyze  构建产物分析编译

build:speed 测速编译

## 文件夹目录

```
vuecli_vue2_js
├── dist
│   ├── vuecli_vue2_js              // pagename
│   │   ├── js                      // 异步js存放/js文件夹下
│   │   │   ├── about.js.map
│   │   │   ├── about.js
│   │   │   ├── HelloWorld.js.map
│   │   │   └── HelloWorld.js
│   │   ├── css                     // 异步css存放/css文件夹下
│   │   │   ├── index.css
│   │   │   └── HelloWorld.css
│   │   ├── chunk-vendors.js.map    
│   │   ├── chunk-vendors.js        // 同步js存放在/pagename目录下
│   │   ├── index.js.map
│   │   ├── index.js
│   │   └── index.css
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── apis                        // api存放目录
│   │   └── a.js
│   ├── assets                      // 静态资源存放目录
│   │   ├── styles
│   │   ├── images
│   │   │   └── logo.png
│   │   └── fonts
│   ├── constants                   // 常量映射
│   │   └── index.js
│   ├── views                       // 页面存放目录
│   │   ├── B-page                  // 页面B
│   │   │   └── About.vue
│   │   └── A-page                  // 页面A
│   │       ├── components          // 页面A组件
│   │       │   └── HelloWorld.vue
│   │       └── Home.vue
│   ├── utils                       // 工具函数存放目录
│   ├── store
│   │   └── index.js
│   ├── router
│   │   └── index.js
│   ├── main.js                     // 入口js
│   └── App.vue                     // 入口app

├── public
│   ├── index.html
│   └── favicon.ico
├── package.json
├── package-lock.json
├── babel.config.js     // babel配置文件
├── .gitignore
├── .eslintrc.js
├── .env.release        // 测试环境变量
├── .env.production     // 现网环境变量
├── .env.develop        // 开发环境变量
├── .env                // 全局环境变量
├── .browserslistrc
├── publicPath.js       // 动态修改publicPath文件
├── README.md
└── vue.config.js
