import { Router } from 'express';
import * as categoryService from '../services/categoryService';

const router = Router();

// 创建分类
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.json({ message: '分类创建成功', category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});