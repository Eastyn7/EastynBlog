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
