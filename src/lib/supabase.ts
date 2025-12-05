import { createClient } from '@supabase/supabase-js';

// Supabase 官方云服务配置
const supabaseUrl = 'https://seiqviqyqfjcchbsinqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlaXF2aXF5cWZqY2NoYnNpbnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDM5NDUsImV4cCI6MjA4MDUxOTk0NX0.Xj_G6_0PGdr-i3GvcZNQz8N3NEP6sDxg2f2MkyW21Ic';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户类型
export interface User {
  id: string;
  username: string;
  created_at: string;
}

// 简单的密码哈希函数（生产环境建议使用 bcrypt）
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'safecareer_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 验证密码
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};
