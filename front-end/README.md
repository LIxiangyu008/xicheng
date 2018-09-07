# xw

> planning and construction project of xuwei

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 前端代码提交

* 前端代码一律放置在front-end文件内，dist及node_modules文件不提交
* 项目后期有可能会变更的配置项提取至static/config/app-config.js中

## 服务端部署

``` bash
# 安装依赖
npm install

# 编译前端代码
npm run build

# 将dist文件夹下生成的全部文件拷贝到项目webapp下即可...
```
