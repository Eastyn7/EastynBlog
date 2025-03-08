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

### JWT处理Token

安装JWT库

~~~bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
~~~

编写工具函数

~~~ts
/* src/utils/jwtUtils.ts */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'eastynBlogSecret';

export const generateToken = (payload: object, expiresIn: number = 43200): string => {
  return 'Bearer ' + jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
~~~

### 身份鉴权中间件

编写函数

~~~ts
/* src/middlewares/authenticationMiddleware.ts */
import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/responseUtil'
import { verifyToken } from '../utils/jwtUtils' // 引入封装的 JWT 验证方法

// 允许跳过 JWT 认证的路由
const UNPROTECTED_PATH_REGEX = /^\/api\/public/

/**
 * JWT 验证中间件
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  // 允许跳过验证的路径
  if (UNPROTECTED_PATH_REGEX.test(req.path)) {
    return next()
  }

  // 从请求头获取 Authorization
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1] // 提取 Bearer token

  if (!token) {
    return errorResponse(res, '没有提供 Token，访问被拒绝', 401) 
  }

  // 验证 token
  const user = verifyToken(token)
  if (!user) {
    return errorResponse(res, 'Token 无效', 403)
  }

  // 将解码后的用户信息存入 request 对象中
  req.body.user = user

  // 获取用户请求体中的 id
  const { id: requestAuthId } = req.body
  const { id: analysisId } = user

  // 比较解码出的 id 与请求中的 id 是否一致
  if (analysisId !== requestAuthId) {
    return errorResponse(res, 'id 与 token 不匹配', 403)
  }

  next() // 继续执行后续中间件或路由
}

/**
 * JWT 用户验证
 * 适合特殊情况验证
 */
export const authenticateUser = (id: number, token: string): boolean => {
  // 验证 token 并解析
  const user = verifyToken(token)

  if (!user) {
    throw new Error('token 无效')
  }

  const analysisId = user.id

  if (analysisId !== id) {
    throw new Error('id 与 token 不匹配')
  }

  return true // 如果验证通过，返回 true
}

/**
 * 权限控制中间件
 * @param allowedRoles 允许访问该接口的角色列表
 */
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.user // 需要 `authenticateToken` 先执行，才能获取 `user`

    if (!user || !allowedRoles.includes(user.role)) {
      return errorResponse(res, '没有权限！', 403)
    }

    next() // 继续执行后续中间件或路由
  }
}
~~~

### 用户相关工具

对密码进行加密和解密

~~~ts
/* src/utils/passwordUtils.ts */
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
~~~

登录/注册表单验证中间件

~~~ts
/* src/middlewares/validateInput.ts */
import { errorResponse } from '../utils/responseUtil';
import { Request, Response, NextFunction } from 'express';

// 验证注册请求
export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, password } = req.body;

  if (!username) {
    return errorResponse(res, '用户名不能为空！', 400);
  }
  if (!email) {
    return errorResponse(res, '邮箱不能为空！', 400);
  }

  if (!password || password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return errorResponse(res, '密码长度至少为6位，并且包含大小写字母和数字', 400);
  }

  // 验证通过，调用 next()
  next();
};

// 验证登录请求
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username) {
    return errorResponse(res, '用户名禁止为空！', 400);
  }

  if (!password) {
    return errorResponse(res, '密码不能为空', 400);
  }

  // 验证通过，调用 next()
  next();
};
~~~

### 用户接口

用户Service层

~~~ts
/* src/services/userService.ts */
import { query } from '../db';
import { User, UserRegister, UserLoginResponse, UpdateUserInfo } from '../types/index';
import { generateToken } from '../utils/jwtUtils';
import { hashPassword, comparePassword } from '../utils/passwordUtils';

// 用户注册
export const registerUser = async (username: string, email: string, password: string): Promise<UserRegister> => {
  const existingUser = await query<User[]>('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
  if (existingUser.length > 0) {
    throw new Error('用户名或邮箱已存在');
  }

  const passwordHash = await hashPassword(password);
  const result = await query<{ insertId: number }>('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, passwordHash, email]);
  return { id: result.insertId, username, email };
};

// 用户登录
export const loginUser = async (username: string, password: string): Promise<UserLoginResponse> => {
  const users = await query<User[]>('SELECT * FROM users WHERE username = ?', [username]);
  if (users.length === 0) {
    throw new Error('用户不存在');
  }

  const user = users[0];
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('密码错误');
  }

  const token = generateToken({ id: user.id, username: user.username, role: user.role });
  return { id: user.id, username: user.username, email: user.email, role: user.role, token };
};

// 获取所有用户信息
export const getUsersInfo = async (): Promise<User[]> => {
  return query<User[]>('SELECT id, username, email, role, create_time, update_time FROM users');
};

// 获取单个用户信息
export const getUserInfo = async (id: number): Promise<User> => {
  const userInfo = await query<User[]>(
    `SELECT 
      id, username, email, role
     FROM users
     WHERE id = ?`,
    [id]
  );

  if (userInfo.length === 0) {
    throw new Error('用户信息不存在');
  }

  // 返回用户的详细信息
  return userInfo[0];
};

// 更新用户信息
export const updateUserInfo = async (id: number, updates: UpdateUserInfo): Promise<string> => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  if (!fields) {
    throw new Error('没有可更新的字段');
  }
  values.push(id);
  const result = await query<{ affectedRows: number }>(`UPDATE users SET ${fields} WHERE id = ?`, values);
  return result.affectedRows > 0 ? '更新成功' : '用户不存在或无更改';
};

// 删除用户
export const deleteUser = async (id: number): Promise<string> => {
  const result = await query<{ affectedRows: number }>('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0 ? '删除成功' : '用户不存在';
};
~~~

用户Controller层

~~~ts
/* src/controller/userController.ts */
import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as userService from '../services/userService'

// 用户注册
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body

  try {
    const newUser = await userService.registerUser(username, email, password)
    successResponse(res, newUser, '用户注册成功', 201)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 用户登录
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body

  try {
    const userLogin = await userService.loginUser(username, password)
    successResponse(res, { userLogin }, '登录成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 获取所有用户信息
export const getUsersInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersInfo = await userService.getUsersInfo()
    successResponse(res, { usersInfo }, '获取信息成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 获取单个用户信息
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body

  try {
    const userInfo = await userService.getUserInfo(id)
    successResponse(res, { userInfo }, '获取信息成功', 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 更新用户信息
export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { id, updates } = req.body

  try {
    const result = await userService.updateUserInfo(id, updates)
    successResponse(res, {}, result, 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}

// 删除用户
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body

  try {
    const result = await userService.deleteUser(id)
    successResponse(res, {}, result, 200)
  } catch (error) {
    if (error instanceof Error) {
      errorResponse(res, error.message, 400)
    } else {
      errorResponse(res, "服务器内部错误", 500)
    }
  }
}
~~~

用户路由层

~~~ts
/* src/routers/subRouters/publicRouter.ts */
import { Router } from 'express'
import { registerUser, loginUser } from '../../controllers/userController'
import { validateRegistration, validateLogin } from '../../middlewares/validateInput'

const router = Router()

// 注册路由
router.post('/register', validateRegistration, registerUser)

// 登录路由
router.post('/login', validateLogin, loginUser)

export default router
~~~

~~~ts
/* src/routers/subRouters/userRouter.ts */
import { Router } from 'express'
import { authorizeRole } from '../../middlewares/authenticationMiddleware'
import { getUsersInfo, getUserInfo, updateUserInfo, deleteUser } from '../../controllers/userController'

const router = Router()

// 获取所有用户信息
router.post('/getusersinfo', authorizeRole('owner'), getUsersInfo)

// 获取单个用户信息
router.post('/getuserinfo', getUserInfo)

// 更新用户信息
router.put('/updateuserinfo', updateUserInfo)

// 删除用户
router.delete('/deleteuser', authorizeRole('owner'), deleteUser )

export default router
~~~

