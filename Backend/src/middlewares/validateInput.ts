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
