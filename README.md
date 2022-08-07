## 前言

此项目是 Vue + TypeScript + Bootstrap 仿造知乎专栏构建的项目，它的接口[Vue3-column-api](https://github.com/yk-795/Vue3-column-api) 是用 Node.js express 框架实现的，数据从MySQL数据库获取，具有真实的登录、注册、权限验证、专栏、文章等功能。

## 技术栈

Vue3 + Vuex + vue-router + ES6 + TypeScript + Bootstrap5 + express + nodemon + MySQL

## 项目运行

```

npm install (安装node_modules依赖)

npm run serve (运行项目)

```

## 关于接口数据

此项目的所有数据都是通过Vue3-column-api接口获取，[接口传送地址](https://github.com/yk-795/Vue3-column-api)。

启动该项目的命令为：`npm run start.dev` 。

## 功能

-  登录（退出登录）、注册 -- 完成
-  权限验证（部分页面未登录不可见、token） -- 完成
-  首页 -- 完成
-  专栏列表、专栏详情 -- 完成
-  文章列表、新建文章 -- 完成
-  文章详情、删除文章 -- 完成
-  上传图片/文件 -- 完成
-  加载动画 -- 完成
-  轻提示（成功、失败、警告）-- 完成
