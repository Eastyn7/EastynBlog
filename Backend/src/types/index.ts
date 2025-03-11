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
  description: string;
  create_time?: string;
}

export interface CreateCategory {
  name: string;
  slug: string;
  description: string;
}

export interface UpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  view_count?: number;
  like_count?: number;
  favorite_count?: number;
  create_time?: string;
  update_time?: string;
}

export interface CreatePost {
  user_id: number;
  title: string;
  content: string;
  summary?: string;
}

export interface UpdatePost {
  title?: string;
  slug?: string;
  view_count?: number;
  like_count?: number;
  favorite_count?: number;
  content?: string;
  summary?: string;
}
