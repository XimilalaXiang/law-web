import { supabase } from './supabase';

// 维权学习进度接口
export interface LegalProgress {
  userId: string;
  completedSteps: string[];  // 已完成的步骤ID列表
  decisionTreePath: string | null;  // 用户选择的决策树路径
  currentStep: string | null;  // 当前正在进行的步骤
  notes: Record<string, string>;  // 用户笔记
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'legal_remedy_progress';

// ============ 本地存储 ============
export const getLocalProgress = (): LegalProgress | null => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveLocalProgress = (progress: Partial<LegalProgress>): void => {
  try {
    const existing = getLocalProgress() || {
      userId: 'local',
      completedSteps: [],
      decisionTreePath: null,
      currentStep: null,
      notes: {},
      updatedAt: new Date().toISOString(),
    };
    const updated = {
      ...existing,
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('保存本地进度失败:', e);
  }
};

// ============ Supabase 存储 ============
export const fetchLegalProgress = async (userId: string | null): Promise<string[]> => {
  if (!userId) {
    const local = getLocalProgress();
    return local?.completedSteps || [];
  }

  try {
    const { data, error } = await supabase
      .from('legal_progress')
      .select('completed_steps')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('获取维权进度失败:', error);
      return [];
    }

    return data?.completed_steps || [];
  } catch (e) {
    console.error('获取维权进度失败:', e);
    return [];
  }
};

export const saveLegalProgress = async (
  userId: string | null,
  completedSteps: string[]
): Promise<boolean> => {
  if (!userId) {
    saveLocalProgress({ completedSteps });
    return true;
  }

  try {
    const { error } = await supabase
      .from('legal_progress')
      .upsert({
        user_id: userId,
        completed_steps: completedSteps,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('保存维权进度失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('保存维权进度失败:', e);
    return false;
  }
};

export const addCompletedStep = async (
  userId: string | null,
  stepId: string
): Promise<boolean> => {
  const currentSteps = await fetchLegalProgress(userId);
  if (currentSteps.includes(stepId)) {
    return true;
  }
  const newSteps = [...currentSteps, stepId];
  return saveLegalProgress(userId, newSteps);
};

export const removeCompletedStep = async (
  userId: string | null,
  stepId: string
): Promise<boolean> => {
  const currentSteps = await fetchLegalProgress(userId);
  const newSteps = currentSteps.filter(s => s !== stepId);
  return saveLegalProgress(userId, newSteps);
};

export const toggleCompletedStep = async (
  userId: string | null,
  stepId: string,
  currentlyCompleted: boolean
): Promise<boolean> => {
  if (currentlyCompleted) {
    return removeCompletedStep(userId, stepId);
  } else {
    return addCompletedStep(userId, stepId);
  }
};

// ============ 决策树路径保存 ============
export const saveDecisionPath = async (
  userId: string | null,
  pathId: string
): Promise<boolean> => {
  if (!userId) {
    saveLocalProgress({ decisionTreePath: pathId });
    return true;
  }

  try {
    const { error } = await supabase
      .from('legal_progress')
      .upsert({
        user_id: userId,
        decision_path: pathId,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('保存决策路径失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('保存决策路径失败:', e);
    return false;
  }
};

export const fetchDecisionPath = async (userId: string | null): Promise<string | null> => {
  if (!userId) {
    const local = getLocalProgress();
    return local?.decisionTreePath || null;
  }

  try {
    const { data, error } = await supabase
      .from('legal_progress')
      .select('decision_path')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('获取决策路径失败:', error);
      return null;
    }

    return data?.decision_path || null;
  } catch (e) {
    console.error('获取决策路径失败:', e);
    return null;
  }
};

// ============ 数据迁移 ============
export const migrateLocalLegalToSupabase = async (userId: string): Promise<void> => {
  const localProgress = getLocalProgress();
  if (!localProgress || localProgress.completedSteps.length === 0) {
    return;
  }

  try {
    // 获取云端已有数据
    const cloudSteps = await fetchLegalProgress(userId);
    
    // 合并本地和云端数据
    const mergedSteps = [...new Set([...cloudSteps, ...localProgress.completedSteps])];
    
    // 保存到云端
    await saveLegalProgress(userId, mergedSteps);
    
    // 如果有决策路径也迁移
    if (localProgress.decisionTreePath) {
      await saveDecisionPath(userId, localProgress.decisionTreePath);
    }
    
    // 清除本地数据
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    console.log('本地维权进度已迁移到云端');
  } catch (e) {
    console.error('迁移维权进度失败:', e);
  }
};


