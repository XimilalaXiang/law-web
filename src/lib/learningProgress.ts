import { supabase } from './supabase';

// 学习进度服务
// 登录用户：数据存储在Supabase
// 未登录用户：数据存储在localStorage

const LOCAL_STORAGE_KEY = 'safecareer_learning_progress';

export interface LearningProgress {
  warningKeys: string[];
  lastUpdated: string;
}

// 从localStorage获取进度
const getLocalProgress = (): string[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const data: LearningProgress = JSON.parse(stored);
      return data.warningKeys || [];
    }
  } catch (e) {
    console.error('读取本地进度失败:', e);
  }
  return [];
};

// 保存到localStorage
const saveLocalProgress = (warningKeys: string[]): void => {
  try {
    const data: LearningProgress = {
      warningKeys,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存本地进度失败:', e);
  }
};

// 从Supabase获取进度
export const fetchProgress = async (userId: string | null): Promise<string[]> => {
  // 未登录用户使用localStorage
  if (!userId) {
    return getLocalProgress();
  }

  try {
    const { data, error } = await supabase
      .from('user_learning_progress')
      .select('warning_key')
      .eq('user_id', userId);

    if (error) {
      console.error('获取Supabase进度失败:', error);
      // 降级到localStorage
      return getLocalProgress();
    }

    return data?.map(item => item.warning_key) || [];
  } catch (e) {
    console.error('获取进度异常:', e);
    return getLocalProgress();
  }
};

// 添加一个学习项
export const addProgress = async (userId: string | null, warningKey: string): Promise<boolean> => {
  // 未登录用户使用localStorage
  if (!userId) {
    const current = getLocalProgress();
    if (!current.includes(warningKey)) {
      saveLocalProgress([...current, warningKey]);
    }
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_learning_progress')
      .insert({
        user_id: userId,
        warning_key: warningKey,
      });

    if (error) {
      // 可能是重复键，忽略
      if (error.code === '23505') {
        return true;
      }
      console.error('添加Supabase进度失败:', error);
      // 降级到localStorage
      const current = getLocalProgress();
      if (!current.includes(warningKey)) {
        saveLocalProgress([...current, warningKey]);
      }
    }
    return true;
  } catch (e) {
    console.error('添加进度异常:', e);
    return false;
  }
};

// 移除一个学习项
export const removeProgress = async (userId: string | null, warningKey: string): Promise<boolean> => {
  // 未登录用户使用localStorage
  if (!userId) {
    const current = getLocalProgress();
    saveLocalProgress(current.filter(k => k !== warningKey));
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_learning_progress')
      .delete()
      .eq('user_id', userId)
      .eq('warning_key', warningKey);

    if (error) {
      console.error('删除Supabase进度失败:', error);
      // 降级到localStorage
      const current = getLocalProgress();
      saveLocalProgress(current.filter(k => k !== warningKey));
    }
    return true;
  } catch (e) {
    console.error('删除进度异常:', e);
    return false;
  }
};

// 切换学习项状态
export const toggleProgress = async (
  userId: string | null,
  warningKey: string,
  currentlyChecked: boolean
): Promise<boolean> => {
  if (currentlyChecked) {
    return removeProgress(userId, warningKey);
  } else {
    return addProgress(userId, warningKey);
  }
};

// 迁移本地数据到Supabase（登录后调用）
export const migrateLocalToSupabase = async (userId: string): Promise<void> => {
  const localProgress = getLocalProgress();
  
  if (localProgress.length === 0) return;

  try {
    // 批量插入，忽略冲突
    const inserts = localProgress.map(warning_key => ({
      user_id: userId,
      warning_key,
    }));

    const { error } = await supabase
      .from('user_learning_progress')
      .upsert(inserts, { onConflict: 'user_id,warning_key' });

    if (!error) {
      // 清除本地存储
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log('本地数据已迁移到云端');
    }
  } catch (e) {
    console.error('迁移数据失败:', e);
  }
};




