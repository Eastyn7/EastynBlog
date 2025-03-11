import { Router } from 'express';
import { authorizeRole } from '../../middlewares/authenticationMiddleware';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../../controllers/categoryController';

const router = Router();

// 创建分类
router.post('/createcategory', authorizeRole('owner'), createCategory);

// 获取所有分类
router.post('/getcategories', getCategories);

// 获取单个分类
router.post('/getcategory', getCategory);

// 更新分类
router.put('/updatecategory', authorizeRole('owner'), updateCategory);

// 删除分类
router.delete('/deletecategory', authorizeRole('owner'), deleteCategory);

export default router;