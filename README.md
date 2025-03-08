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
    "dev": "nodemon src/app.ts",
    "start": "ts-node src/app.ts"
},
~~~

安装detenv，自行配置.env文件

~~~bash
npm install dotenv
~~~

~~~ini
JWT_SECRET = your_secret_key
DB_HOST = localhost
DB_USER = root
DB_PASS = yourpassword
~~~

初始化目录结构

~~~bash
D:.
|   package-lock.json
|   package.json
|   tsconfig.json
|   
\---src
    |   app.ts
    |   
    +---db
    |       index.ts
    |       
    +---middlewares
    |       authenticationMiddleware.ts
    |       errorHandler.ts
    |       
    +---routers
    |       index.ts
    |
    \---utils
            responseUtil.ts
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

### 配置跨域

安装cors中间件

~~~bash
npm install cors
npm install --save-dev @types/cors
~~~

在app.ts文件中引入

~~~ts
import cors from 'cors';
app.use(cors());
~~~

### 连接数据库

安装MySQL模块

~~~bash
npm install mysql
npm install --save-dev @types/mysql
~~~

配置基础设置

~~~ts
/* src/db/index.ts */
import mysql from 'mysql';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: '用户名',
  password: '密码',
  database: '数据库表名'
});

// 封装 db.query 为 Promise
export const query = <T>(sql: string, values?: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

export default db;
~~~

### 响应处理中间件

~~~ts
/* src/utils/responseUtil.ts */
import { Response, NextFunction } from 'express';

interface ResponseFormat {
  status: boolean;
  message: string;
  data?: any;
  errorCode?: string;
  details?: any;
}

/**
 * 成功响应
 * @param res Express Response 对象
 * @param data 返回数据
 * @param message 消息
 * @param statusCode HTTP 状态码 (默认 200)
 */
export const successResponse = (res: Response, data?: any, message = 'Success', statusCode = 200) => {
  const response: ResponseFormat = {
    status: true,
    message,
    data
  };
  res.status(statusCode).json(response);
};

/**
 * 失败响应
 * @param res Express Response 对象
 * @param message 错误消息
 * @param statusCode HTTP 状态码 (默认 500)
 * @param errorCode 自定义错误代码 (可选)
 * @param details 额外错误信息 (可选)
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  errorCode?: string,
  details?: any
) => {
  const response: ResponseFormat = {
    status: false,
    message,
    errorCode,
    details
  };
  res.status(statusCode).json(response);
};
~~~

~~~ts
/* src/middlewares/errorHandler.ts */
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseUtil';

/**
 * 全局错误处理中间件
 * @param err 错误对象
 * @param req Express Request 对象
 * @param res Express Response 对象
 * @param next Express NextFunction
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error Handler]:', err);

  // 解析错误信息
  const statusCode = err.statusCode || 500; // 获取错误状态码，默认为500
  const message = err.message || 'Internal Server Error'; // 默认错误消息
  const errorCode = err.errorCode || 'UNKNOWN_ERROR'; // 自定义错误代码（可选）
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined; // 仅在开发环境返回错误详情

  // 统一响应错误
  errorResponse(res, message, statusCode, errorCode, details);

  next(); // 保持 Express 中间件兼容性
};
~~~

### 身份鉴权中间件

安装JWT库

~~~bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
~~~

编写函数

~~~ts
/* src/middlewares/authenticationMiddleware.ts */
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// 使用环境变量存储 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || 'eastynBlogSecret';

// 允许跳过 JWT 认证的路由
const UNPROTECTED_PATH_REGEX = /^\/api\/public/;

/**
 * JWT 验证中间件
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  // 允许跳过验证的路径
  if (UNPROTECTED_PATH_REGEX.test(req.path)) {
    return next();
  }

  // 从请求头获取 Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: '没有提供 Token，访问被拒绝' });
  }

  // 验证 token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token 无效' });
    }

    // 将解码后的用户信息存入 request 对象中
    req.body.user = user;

    // 获取用户请求体中的 user_id
    const { user_id: requestAuthId } = req.body;
    const { user_id: analysisId } = req.body.user;

    // 比较解码出的 user_id 与请求中的 user_id 是否一致
    if (analysisId !== requestAuthId) {
      return res.status(403).json({ message: 'user_id 与 token 不匹配' });
    }

    next(); // 继续执行后续中间件或路由
  });
};

/**
 * JWT 验证中间件
 * 特殊验证需求
 */
export const authenticateUser = (user_id: number, token: string): any => {
  // 验证 token 并解析
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      throw new Error('token 无效');
    }

    const requestAuthId = user_id;
    let analysisId: number;

    if (user && typeof user === 'object' && 'user_id' in user) {
      analysisId = user.user_id;
    } else {
      throw new Error('token 中不包含有效的 user_id');
    }

    if (analysisId !== requestAuthId) {
      throw new Error('user_id 与 token 不匹配');
    }

    return true; // 如果验证通过，返回 true
  });
};
~~~

