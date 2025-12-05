import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, User, hashPassword, verifyPassword } from '../lib/supabase';

// Auth 上下文类型定义
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

// 本地存储键
const USER_STORAGE_KEY = 'safecareer_user';

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从 localStorage 读取用户
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // 注册
  const signUp = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      // 检查用户名是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      if (existingUser) {
        return { error: '用户名已被注册' };
      }

      // 哈希密码
      const passwordHash = await hashPassword(password);

      // 创建用户
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: username.toLowerCase(),
            password_hash: passwordHash,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('注册错误:', error);
        return { error: '注册失败，请重试' };
      }

      // 设置用户状态
      const newUser: User = {
        id: data.id,
        username: data.username,
        created_at: data.created_at,
      };
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      return { error: null };
    } catch (err) {
      console.error('注册异常:', err);
      return { error: '注册失败，请检查网络连接' };
    }
  };

  // 登录
  const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      // 查找用户
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error || !userData) {
        return { error: '用户名或密码错误' };
      }

      // 验证密码
      const isValid = await verifyPassword(password, userData.password_hash);
      if (!isValid) {
        return { error: '用户名或密码错误' };
      }

      // 设置用户状态
      const loggedInUser: User = {
        id: userData.id,
        username: userData.username,
        created_at: userData.created_at,
      };
      
      setUser(loggedInUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      
      return { error: null };
    } catch (err) {
      console.error('登录异常:', err);
      return { error: '登录失败，请检查网络连接' };
    }
  };

  // 登出
  const signOut = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook 用于访问 Auth 上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
};

export default AuthContext;
