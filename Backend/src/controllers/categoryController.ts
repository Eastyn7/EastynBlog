import { successResponse, errorResponse } from '../utils/responseUtil';
import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

// 创建分类
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, slug, description } = req.body;
  try {
    const newCategory = await categoryService.createCategory(name, description);
    successResponse(res, { newCategory }, '分类创建成功', 201);
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : '服务器内部错误', 500);
  }
};

// 获取所有分类
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();
    successResponse(res, { categories }, '获取分类成功', 200);
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : '服务器内部错误', 500);
  }
};

// 获取单个分类
export const getCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body;
  try {
    const category = await categoryService.getCategory(id);
    successResponse(res, { category }, '获取分类成功', 200);
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : '服务器内部错误', 500);
  }
};

// 更新分类
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id, updates } = req.body;
  try {
    const result = await categoryService.updateCategory(id, updates);
    successResponse(res, {}, result, 200);
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : '服务器内部错误', 500);
  }
};

// 删除分类
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body;
  try {
    const result = await categoryService.deleteCategory(id);
    successResponse(res, {}, result, 200);
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : '服务器内部错误', 500);
  }
};