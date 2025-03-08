import { query } from '../db';
import { User, UserRegister, UserLoginResponse, UpdateUserInfo } from '../types/index';
import { generateToken } from '../utils/jwtUtils';
import { hashPassword, comparePassword } from '../utils/passwordUtils';

// 用户注册
export const registerUser = async (username: string, email: string, password: string): Promise<UserRegister> => {
  const existingUser = await query<User[]>('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
  if (existingUser.length > 0) {
    throw new Error('用户名或邮箱已存在');
  }

  const passwordHash = await hashPassword(password);
  const result = await query<{ insertId: number }>('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, passwordHash, email]);
  return { id: result.insertId, username, email };
};

// 用户登录
export const loginUser = async (username: string, password: string): Promise<UserLoginResponse> => {
  const users = await query<User[]>('SELECT * FROM users WHERE username = ?', [username]);
  if (users.length === 0) {
    throw new Error('用户不存在');
  }

  const user = users[0];
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('密码错误');
  }

  const token = generateToken({ id: user.id, username: user.username, role: user.role });
  return { id: user.id, username: user.username, email: user.email, role: user.role, token };
};

// 获取所有用户信息
export const getUsersInfo = async (): Promise<User[]> => {
  return query<User[]>('SELECT id, username, email, role, create_time, update_time FROM users');
};

// 获取单个用户信息
export const getUserInfo = async (id: number): Promise<User> => {
  const userInfo = await query<User[]>(
    `SELECT 
      id, username, email, role
     FROM users
     WHERE id = ?`,
    [id]
  );

  if (userInfo.length === 0) {
    throw new Error('用户信息不存在');
  }

  // 返回用户的详细信息
  return userInfo[0];
};

// 更新用户信息
export const updateUserInfo = async (id: number, updates: UpdateUserInfo): Promise<string> => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  if (!fields) {
    throw new Error('没有可更新的字段');
  }
  values.push(id);
  const result = await query<{ affectedRows: number }>(`UPDATE users SET ${fields} WHERE id = ?`, values);
  return result.affectedRows > 0 ? '更新成功' : '用户不存在或无更改';
};

// 删除用户
export const deleteUser = async (id: number): Promise<string> => {
  const result = await query<{ affectedRows: number }>('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0 ? '删除成功' : '用户不存在';
};
