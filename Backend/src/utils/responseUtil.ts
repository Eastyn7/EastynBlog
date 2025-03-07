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
