export interface User {
  id: number
  username: string
  email: string
  password: string
  role: 'owner' | 'visitor'
  create_time: string
  update_time: string
}

export interface UserRegister {
  id: number
  username: string
  email: string
}

export interface UserLoginResponse {
  id: number
  username: string
  email: string
  role: string
  token: string
}

export interface UpdateUserInfo {
  username?: string
  email?: string
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  create_time?: string;
}

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
}
