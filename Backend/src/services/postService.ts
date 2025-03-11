import { query } from '../db';
import { Post, CreatePost, UpdatePost } from '../types/index';
import { slugifyUtil } from '../utils/slugUtils';

// 创建文章
export const createPost = async (name: string, description: string): Promise<CreatePost> => {
  const slug = slugifyUtil(name)
  const result = await query<Post>('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [name, slug, description]);
  return result;
};

// 获取所有文章
export const getCategories = async (): Promise<Post[]> => {
  return query<Post[]>('SELECT id, name, slug, description FROM categories');
};

// 获取单个文章
export const getPost = async (id: number): Promise<Post> => {
  const categories = await query<Post[]>('SELECT id, name, slug, description FROM categories WHERE id = ?', [id]);
  if (categories.length === 0) {
    throw new Error('文章不存在');
  }
  return categories[0];
};

// 更新文章
export const updatePost = async (id: number, updates: UpdatePost): Promise<string> => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  if (!fields) {
    throw new Error('没有可更新的字段');
  }
  values.push(id);
  const result = await query<{ affectedRows: number }>(`UPDATE categories SET ${fields} WHERE id = ?`, values);
  return result.affectedRows > 0 ? '更新成功' : '文章不存在或无更改';
};

// 删除文章
export const deletePost = async (id: number): Promise<string> => {
  const result = await query<{ affectedRows: number }>('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0 ? '删除成功' : '文章不存在';
};