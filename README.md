# Eastyn的个人博客网站

## 项目概述

**项目名称**：EastynBlog

**启动时间**：2025-03-07

**项目状态**：开发中

**技术栈**：

- 前端：Vue 3
- 后端：Node.js
- 数据库：MySQL

## 数据库

### 数据库设计

~~~mysql
-- 用户表：存储博客博主与普通访客信息
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID，自增主键',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名，唯一标识',
  `password` VARCHAR(255) NOT NULL COMMENT '密码，经过加密后存储',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '用户邮箱，唯一',
  `role` ENUM('owner', 'visitor') DEFAULT 'visitor' COMMENT '用户角色：owner为博主，visitor为普通访客',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '用户注册时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '用户信息最后更新时间'
) COMMENT='用户表，记录博主与访客的基本信息';

-- 文章表：存储博主发布的博客文章
CREATE TABLE `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '文章ID，自增主键',
  `user_id` INT NOT NULL COMMENT '发布者用户ID，关联users表（仅限博主）',
  `title` VARCHAR(255) NOT NULL COMMENT '文章标题',
  `slug` VARCHAR(255) NOT NULL COMMENT '友好URL别名，用于构建文章链接',
  `content` TEXT NOT NULL COMMENT '文章正文内容',
  `summary` TEXT COMMENT '文章摘要，用于列表预览',
  `view_count` INT DEFAULT 0 COMMENT '文章浏览次数',
  `like_count` INT DEFAULT 0 COMMENT '文章点赞次数',
  `favorite_count` INT DEFAULT 0 COMMENT '文章收藏次数',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) COMMENT='文章表，存储博主发布的博客内容';

-- 分类表（可选）：用于对博客文章进行归类管理
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID，自增主键',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(50) NOT NULL COMMENT '友好URL别名',
  `description` TEXT COMMENT '分类描述信息',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '分类创建时间'
) COMMENT='分类表，用于管理博客文章的分类';

-- 点赞表：记录访客对文章的点赞行为
CREATE TABLE `post_likes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID，自增主键',
  `post_id` INT NOT NULL COMMENT '文章ID，关联posts表',
  `user_id` INT NOT NULL COMMENT '点赞的用户ID，关联users表',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) COMMENT='点赞表，记录每一次访客的点赞行为';

-- 收藏表：记录访客对文章的收藏行为
CREATE TABLE `post_favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID，自增主键',
  `post_id` INT NOT NULL COMMENT '文章ID，关联posts表',
  `user_id` INT NOT NULL COMMENT '收藏的用户ID，关联users表',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) COMMENT='收藏表，记录访客的收藏行为';
~~~



## 后端

### 初始化

初始化项目

~~~bash
npm init -y
~~~

安装Express框架

~~~bash
npm install express
~~~

安装 TypeScript、ts-node 以及 Express 的类型声明：

~~~bash
npm install --save-dev typescript ts-node @types/node @types/express
~~~

初始化TypeScript配置文件

~~~bash
npx tsc --init
~~~

~~~json
/* tsconfig.json */
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
~~~

初始化项目启动指令

~~~json
/* package.json */  
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "ts-node src/app.ts"
},
~~~

初始化目录结构

~~~bash
D:.
|   package-lock.json
|   package.json
|   tsconfig.json
|
+---node_modules
\---src
    |   app.ts
    |
    +---controllers
    +---db
    +---middlewares
    +---oss
    +---routers
        |   index.ts
        |
    +---services
    +---types
    \---utils
~~~

初始化app.ts项目主文件

~~~tsx
import express from 'express';
import router from './routers/index';

const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 路由
app.use('/api', router);

// 启动服务器
app.listen(3307, () => {
  console.log('API server running at http://127.0.0.1:3307');
});
~~~





