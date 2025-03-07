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
