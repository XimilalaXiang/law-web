import { supabase } from './supabase';

// 测验历史记录服务
// 登录用户：数据存储在Supabase
// 未登录用户：数据存储在localStorage

const LOCAL_STORAGE_KEY = 'safecareer_quiz_history';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizResult {
  id?: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  percentage: number;
  completed_at: string;
}

export interface QuizHistory {
  results: QuizResult[];
  bestScores: {
    easy: QuizResult | null;
    medium: QuizResult | null;
    hard: QuizResult | null;
  };
}

// 从localStorage获取历史记录
const getLocalHistory = (): QuizResult[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as QuizResult[];
    }
  } catch (e) {
    console.error('读取本地测验历史失败:', e);
  }
  return [];
};

// 保存到localStorage
const saveLocalHistory = (results: QuizResult[]): void => {
  try {
    // 只保留最近20条记录
    const trimmed = results.slice(-20);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('保存本地测验历史失败:', e);
  }
};

// 从Supabase获取测验历史
export const fetchQuizHistory = async (userId: string | null): Promise<QuizResult[]> => {
  // 未登录用户使用localStorage
  if (!userId) {
    return getLocalHistory();
  }

  try {
    const { data, error } = await supabase
      .from('user_quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('获取Supabase测验历史失败:', error);
      // 降级到localStorage
      return getLocalHistory();
    }

    return data?.map(item => ({
      id: item.id,
      difficulty: item.difficulty as Difficulty,
      score: item.score,
      total: item.total,
      percentage: item.percentage,
      completed_at: item.completed_at,
    })) || [];
  } catch (e) {
    console.error('获取测验历史异常:', e);
    return getLocalHistory();
  }
};

// 保存测验结果
export const saveQuizResult = async (
  userId: string | null,
  result: Omit<QuizResult, 'id' | 'completed_at'>
): Promise<boolean> => {
  const now = new Date().toISOString();
  const fullResult: QuizResult = {
    ...result,
    completed_at: now,
  };

  // 未登录用户使用localStorage
  if (!userId) {
    const current = getLocalHistory();
    saveLocalHistory([...current, fullResult]);
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_quiz_results')
      .insert({
        user_id: userId,
        difficulty: result.difficulty,
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        completed_at: now,
      });

    if (error) {
      console.error('保存Supabase测验结果失败:', error);
      // 降级到localStorage
      const current = getLocalHistory();
      saveLocalHistory([...current, fullResult]);
    }
    return true;
  } catch (e) {
    console.error('保存测验结果异常:', e);
    return false;
  }
};

// 获取各难度最佳成绩
export const getBestScores = (results: QuizResult[]): QuizHistory['bestScores'] => {
  const bestScores: QuizHistory['bestScores'] = {
    easy: null,
    medium: null,
    hard: null,
  };

  results.forEach(result => {
    const current = bestScores[result.difficulty];
    if (!current || result.percentage > current.percentage) {
      bestScores[result.difficulty] = result;
    }
  });

  return bestScores;
};

// 获取完整的测验历史数据
export const getQuizHistory = async (userId: string | null): Promise<QuizHistory> => {
  const results = await fetchQuizHistory(userId);
  const bestScores = getBestScores(results);
  
  return {
    results,
    bestScores,
  };
};

// 迁移本地数据到Supabase（登录后调用）
export const migrateLocalQuizToSupabase = async (userId: string): Promise<void> => {
  const localResults = getLocalHistory();
  
  if (localResults.length === 0) return;

  try {
    // 批量插入
    const inserts = localResults.map(result => ({
      user_id: userId,
      difficulty: result.difficulty,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      completed_at: result.completed_at,
    }));

    const { error } = await supabase
      .from('user_quiz_results')
      .insert(inserts);

    if (!error) {
      // 清除本地存储
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log('本地测验数据已迁移到云端');
    }
  } catch (e) {
    console.error('迁移测验数据失败:', e);
  }
};

// 格式化日期显示
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
};

// 获取难度标签
export const getDifficultyLabel = (difficulty: Difficulty): string => {
  const labels: Record<Difficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return labels[difficulty];
};

// 获取难度颜色
export const getDifficultyColor = (difficulty: Difficulty): string => {
  const colors: Record<Difficulty, string> = {
    easy: '#22c55e',
    medium: '#FFC700',
    hard: '#ef4444',
  };
  return colors[difficulty];
};




