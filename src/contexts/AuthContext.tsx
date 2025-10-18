import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'student' | 'teacher';

interface LocalUser {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: LocalUser | null;
  userRole: UserRole | null;
  login: (username: string, password: string) => Promise<{ error: Error | null }>;
  signup: (username: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 简单的本地用户存储（实际应用中应使用真实数据库）
const getStoredUsers = (): LocalUser[] => {
  const stored = localStorage.getItem('app_users');
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: LocalUser[]) => {
  localStorage.setItem('app_users', JSON.stringify(users));
};

const getCurrentUser = (): LocalUser | null => {
  const stored = localStorage.getItem('current_user');
  return stored ? JSON.parse(stored) : null;
};

const setCurrentUser = (user: LocalUser | null) => {
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('current_user');
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
      setUserRole(currentUser.role);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // 验证用户名和密码长度
      if (!username || username.length < 3) {
        return { error: new Error('用户名至少需要3个字符') };
      }
      if (!password || password.length < 6) {
        return { error: new Error('密码至少需要6个字符') };
      }

      // 从本地存储中查找用户
      const users = getStoredUsers();
      const foundUser = users.find(u => u.username === username);

      if (!foundUser) {
        return { error: new Error('用户不存在') };
      }

      // 简单的密码验证（实际应用中应使用加密）
      const storedPassword = localStorage.getItem(`pwd_${username}`);
      if (storedPassword !== password) {
        return { error: new Error('密码错误') };
      }

      // 登录成功
      setUser(foundUser);
      setUserRole(foundUser.role);
      setCurrentUser(foundUser);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signup = async (username: string, password: string, fullName: string, role: UserRole) => {
    try {
      // 验证用户名和密码长度
      if (!username || username.length < 3) {
        return { error: new Error('用户名至少需要3个字符') };
      }
      if (!password || password.length < 6) {
        return { error: new Error('密码至少需要6个字符') };
      }
      if (!fullName || fullName.length < 2) {
        return { error: new Error('姓名至少需要2个字符') };
      }

      // 检查用户名是否已存在
      const users = getStoredUsers();
      if (users.some(u => u.username === username)) {
        return { error: new Error('用户名已存在') };
      }

      // 创建新用户
      const newUser: LocalUser = {
        id: Date.now().toString(),
        username,
        role,
      };

      // 保存用户信息
      users.push(newUser);
      saveUsers(users);

      // 保存密码（实际应用中应使用加密）
      localStorage.setItem(`pwd_${username}`, password);
      localStorage.setItem(`fullname_${username}`, fullName);

      // 自动登录
      setUser(newUser);
      setUserRole(role);
      setCurrentUser(newUser);

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