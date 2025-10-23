import apiClient from '@/lib/api';
import { User, CreateUserRequest } from './userService';

/**
 * 登录请求
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * 注册请求
 */
export interface RegisterRequest extends CreateUserRequest {
  confirmPassword?: string;
}

/**
 * API 响应格式
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 认证服务
 */
export const authService = {
  /**
   * 用户登录
   * @param username 用户名或邮箱
   * @param password 密码
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', {
        username,
        password,
      });
      
      const { token, user } = response.data;
      
      // 保存 token 和用户信息到本地存储
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));
      
      return { token, user };
    } catch (error: any) {
      const message = error.response?.data?.message || '登录失败';
      throw new Error(message);
    }
  },

  /**
   * 用户注册
   * @param request 注册请求
   */
  async register(request: RegisterRequest): Promise<User> {
    try {
      // 移除 confirmPassword 字段
      const { confirmPassword, ...registerData } = request;
      
      const response = await apiClient.post<ApiResponse<User>>('/api/auth/register', registerData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || '注册失败';
      throw new Error(message);
    }
  },

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 清除本地存储
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/api/auth/current');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * 刷新 Token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponse<{ token: string }>>('/api/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('auth_token', token);
      return token;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Token 刷新失败';
      throw new Error(message);
    }
  },

  /**
   * 获取本地存储的用户信息
   */
  getStoredUser(): User | null {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  },

  /**
   * 获取本地存储的 Token
   */
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * 检查用户是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.getStoredToken();
  },

  /**
   * 清除本地存储
   */
  clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  },
};

export default authService;

