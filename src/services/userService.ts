import apiClient from '@/lib/api';

/**
 * 用户信息接口
 */
export interface User {
  id: number;
  username: string;
  email: string;
  realName: string;
  phone?: string;
  idCard?: string;
  studentId?: string;
  avatarUrl?: string;
  status: number; // 0-禁用，1-正常，2-待审核
  lastLoginTime?: string;
  lastLoginIp?: string;
  loginCount?: number;
  createTime: string;
  updateTime: string;
  createBy?: string;
  updateBy?: string;
  roles?: Role[];
}

/**
 * 角色信息接口
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
}

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  realName: string;
  phone?: string;
  idCard?: string;
  studentId?: string;
  avatarUrl?: string;
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  realName?: string;
  phone?: string;
  idCard?: string;
  studentId?: string;
  avatarUrl?: string;
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
 * 用户服务
 */
export const userService = {
  /**
   * 创建用户
   */
  async createUser(request: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/api/users', request);
    return response.data;
  },

  /**
   * 获取用户信息
   */
  async getUser(userId: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/api/users/${userId}`);
    return response.data;
  },

  /**
   * 更新用户信息
   */
  async updateUser(userId: number, request: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${userId}`, request);
    return response.data;
  },

  /**
   * 删除用户
   */
  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`/api/users/${userId}`);
  },

  /**
   * 启用用户
   */
  async enableUser(userId: number): Promise<void> {
    await apiClient.post(`/api/users/${userId}/enable`);
  },

  /**
   * 禁用用户
   */
  async disableUser(userId: number): Promise<void> {
    await apiClient.post(`/api/users/${userId}/disable`);
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/api/users/current');
    return response.data;
  },
};

export default userService;

