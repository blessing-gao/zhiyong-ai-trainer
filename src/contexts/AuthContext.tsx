import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/api';

type UserRole = 'user' | 'admin';

interface LocalUser {
  id: number;
  username: string;
  userType: UserRole;
  realName?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: LocalUser | null;
  userRole: UserRole | null;
  login: (username: string, password: string) => Promise<{ error: Error | null }>;
  signup: (username: string, password: string, email: string, fullName?: string, phone?: string) => Promise<{ error: Error | null }>;
  adminLogin: (username: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCurrentUser = (): LocalUser | null => {
  const stored = localStorage.getItem('current_user');
  return stored ? JSON.parse(stored) : null;
};

const setCurrentUser = (user: LocalUser | null) => {
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
    if (user.accessToken) {
      localStorage.setItem('access_token', user.accessToken);
    }
  } else {
    localStorage.removeItem('current_user');
    localStorage.removeItem('access_token');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化时从本地存储恢复用户状态
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserRole(currentUser.userType);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // 调用后端登录接口
      const response: any = await authApi.login({ username, password });

      if (response.code !== 0) {
        return { error: new Error(response.msg || '登录失败') };
      }

      const userData: LocalUser = {
        id: response.data.id,
        username: response.data.username,
        userType: response.data.user_type as UserRole,
        realName: response.data.real_name,
        accessToken: response.data.access_token,
      };

      // 保存用户信息
      setUser(userData);
      setUserRole(userData.userType);
      setCurrentUser(userData);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signup = async (username: string, password: string, email: string, fullName?: string, phone?: string) => {
    try {
      // 调用后端注册接口
      const response: any = await authApi.register({
        username,
        password,
        confirmPassword: password,
        email,
        phone,
        realName: fullName,
      });

      if (response.code !== 0) {
        return { error: new Error(response.msg || '注册失败') };
      }

      // 注册成功后自动登录
      return await login(username, password);
    } catch (error) {
      return { error: error as Error };
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      // 调用后端管理员登录接口
      const response: any = await authApi.adminLogin({ username, password });

      if (response.code !== 0) {
        return { error: new Error(response.msg || '登录失败') };
      }

      const userData: LocalUser = {
        id: response.data.id,
        username: response.data.username,
        userType: response.data.user_type as UserRole,
        realName: response.data.real_name,
        accessToken: response.data.access_token,
      };

      // 保存用户信息
      setUser(userData);
      setUserRole(userData.userType);
      setCurrentUser(userData);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    setUser(null);
    setUserRole(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      login,
      signup,
      adminLogin,
      logout,
      isLoggedIn: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};