import { successResponse, errorResponse } from '../utils/responseUtil'
import { Request, Response } from 'express'
import * as userService from '../services/userServices'

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
