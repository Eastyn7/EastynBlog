import { query } from '../db';
import { Category, CreateCategory, UpdateCategory } from '../types/index';
import { slugifyUtil } from '../utils/slugUtils';

// 创建分类
export const createCategory = async (name: string, description: string): Promise<CreateCategory> => {
  const slug = slugifyUtil(name)
  const result = await query<Category>('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [name, slug, description]);
  return result;
};

// 获取所有分类
export const getCategories = async (): Promise<Category[]> => {
  return query<Category[]>('SELECT id, name, slug, description FROM categories');
};

// 获取单个分类
export const getCategory = async (id: number): Promise<Category> => {
  const categories = await query<Category[]>('SELECT id, name, slug, description FROM categories WHERE id = ?', [id]);
  if (categories.length === 0) {
    throw new Error('分类不存在');
  }
  return categories[0];
};

// 更新分类
export const updateCategory = async (id: number, updates: UpdateCategory): Promise<string> => {
  let newSlug;
  if (updates.name) {
    // 如果传入了 name 字段，重新生成 slug
    newSlug = slugifyUtil(updates.name);
    // 将新的 slug 添加到更新字段中
    updates = { ...updates, slug: newSlug };
  }

  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  if (!fields) {
    throw new Error('没有可更新的字段');
  }
  values.push(id);
  const result = await query<{ affectedRows: number }>(`UPDATE categories SET ${fields} WHERE id = ?`, values);
  return result.affectedRows > 0 ? '更新成功' : '分类不存在或无更改';
};

// 删除分类
export const deleteCategory = async (id: number): Promise<string> => {
  const result = await query<{ affectedRows: number }>('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0 ? '删除成功' : '分类不存在';
};