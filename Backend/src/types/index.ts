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