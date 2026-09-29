export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  roleId?: string;
  active: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roleId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  message: string;
  user: AuthUser | null;
  token?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: AuthUser | null;
}

export interface LogoutResponse {
  message: string;
}