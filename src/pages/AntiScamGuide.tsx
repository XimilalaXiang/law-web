import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  AlertCircleIcon, 
  CheckIcon, 
  PhoneIcon,
  TrophyIcon,
  CloudIcon,
  HardDriveIcon,
  PlayCircleIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchProgress, 
  toggleProgress, 
  migrateLocalToSupabase 
} from '../lib/learningProgress';
import {
  warningCategories,
  protectionStrategies,
  emergencySteps,
  emergencyContacts,
  getUnlockedAchievements,
  getNextAchievement,
} from '../data/antiScamContent';

// Pill component
const Pill = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'danger' | 'success' }) => {
  const variantClasses = {
    default: '',
    danger: 'pill-danger',
    success: 'pill-success',
  };
  return (
    <div className={`pill ${variantClasses[variant]}`}>
      {children}
      </div>
  );
};

const AntiScamGuide = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviewedWarnings, setReviewedWarnings] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // 加载进度数据
  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const warningKeys = await fetchProgress(user?.id || null);
      const progressMap: Record<string, boolean> = {};
      warningKeys.forEach(key => {
        progressMap[key] = true;
      });
      setReviewedWarnings(progressMap);
    } catch (e) {
      console.error('加载进度失败:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // 初始化时加载进度
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 用户登录后迁移本地数据
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      migrateLocalToSupabase(user.id).then(() => {
        loadProgress();
      });
    }
  }, [isAuthenticated, user?.id, loadProgress]);

  // 切换学习项
  const handleToggleWarning = async (categoryId: string, index: number) => {
      const key = `${categoryId}-${index}`;
    const currentlyChecked = reviewedWarnings[key] || false;
    
    // 乐观更新UI
    setReviewedWarnings(prev => ({ ...prev, [key]: !currentlyChecked }));
    setIsSyncing(true);

    try {
      const success = await toggleProgress(user?.id || null, key, currentlyChecked);
      if (!success) {
        // 回滚
        setReviewedWarnings(prev => ({ ...prev, [key]: currentlyChecked }));
      }
    } catch (e) {
      // 回滚
      setReviewedWarnings(prev => ({ ...prev, [key]: currentlyChecked }));
      console.error('同步失败:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // 统计数据
  const totalWarnings = warningCategories.reduce((sum, cat) => sum + cat.warnings.length, 0);
  const reviewedCount = Object.values(reviewedWarnings).filter(Boolean).length;
  const progress = Math.round((reviewedCount / totalWarnings) * 100);
  
  // 成就系统
  const unlockedAchievements = getUnlockedAchievements(reviewedCount);
  const nextAchievement = getNextAchievement(reviewedCount);

  return (
    <div className="bg-black min-h-screen w-full pt-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="vignette" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Pill variant="success">防骗攻略</Pill>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mt-6">
            大学生求职 <br className="sm:hidden" />
            <span className="italic font-light">防骗</span> 指南
          </h1>
          
          <p className="font-mono text-sm text-white/50 mt-6 max-w-lg mx-auto">
            掌握这些防骗技巧，让你的求职之路更加安全顺畅
          </p>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">{totalWarnings}</div>
              <div className="font-mono text-xs text-white/40 mt-1">预警信号</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">{protectionStrategies.length}</div>
              <div className="font-mono text-xs text-white/40 mt-1">防骗策略</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">{warningCategories.length}</div>
              <div className="font-mono text-xs text-white/40 mt-1">类别覆盖</div>
            </div>
          </div>
        </div>

        {/* Sync Status & Progress Tracker */}
        <div className="card mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center"
                style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
              >
                <CheckIcon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-white font-semibold">学习进度</h3>
                <div className="flex items-center gap-2 font-mono text-xs text-white/40">
                  {isAuthenticated ? (
                    <>
                      <CloudIcon className="h-3 w-3" />
                      <span>已同步到云端</span>
                    </>
                  ) : (
                    <>
                      <HardDriveIcon className="h-3 w-3" />
                      <span>仅保存在本地</span>
                      <Link to="/auth" className="text-[var(--primary)] hover:underline ml-1">
                        登录同步 →
                      </Link>
                    </>
                  )}
                  {isSyncing && <span className="text-[var(--primary)]">同步中...</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl text-[var(--primary)]">{progress}%</div>
              <div className="font-mono text-xs text-white/40">{reviewedCount}/{totalWarnings}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/5 overflow-hidden mb-6"
            style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
          >
            <div 
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[#ffdb4d] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
                  </div>

          {/* Achievements */}
          {(unlockedAchievements.length > 0 || nextAchievement) && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <TrophyIcon className="h-4 w-4 text-[var(--primary)]" />
                <span className="font-mono text-xs text-white/60">成就系统</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {unlockedAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-full"
                  >
                    <span>{achievement.icon}</span>
                    <span className="font-mono text-xs text-[var(--primary)]">{achievement.title}</span>
                  </div>
                ))}
                {nextAchievement && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                    <span className="opacity-50">{nextAchievement.icon}</span>
                    <span className="font-mono text-xs text-white/40">
                      {nextAchievement.title}（还差{nextAchievement.requiredCount - reviewedCount}项）
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 测验入口 */}
        <Link 
          to="/quiz" 
          className="card mb-16 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 hover:border-purple-500/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/40 flex items-center justify-center rounded-xl">
                <PlayCircleIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  防骗能力测验
                </h3>
                <p className="font-mono text-xs text-white/50">
                  通过情境题检验你的防骗知识，完成后可获得证书
                </p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-white/40 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Warning Categories */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Pill variant="danger">预警信号</Pill>
            <h2 className="font-display text-3xl text-white mt-6">
              求职诈骗 <span className="italic font-light">预警信号</span>
              </h2>
            <p className="font-mono text-sm text-white/40 mt-4 max-w-lg mx-auto">
              点击每个预警项标记为已学习，完成所有预警可解锁成就
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin mx-auto" />
              <p className="font-mono text-sm text-white/40 mt-4">加载中...</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {warningCategories.map(category => {
                const CategoryIcon = category.icon;
                const categoryReviewed = category.warnings.filter((_, i) => reviewedWarnings[`${category.id}-${i}`]).length;
                
                return (
                  <div key={category.id} className="feature-card group">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="w-12 h-12 flex items-center justify-center border"
                        style={{ 
                          borderColor: `${category.color}50`,
                          backgroundColor: `${category.color}10`,
                          clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
                        }}
                      >
                        <CategoryIcon className="h-6 w-6" style={{ color: category.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                        <div className="font-mono text-xs text-white/40">
                          {categoryReviewed}/{category.warnings.length} 已学习
              </div>
            </div>
          </div>

                    {/* Warning Items */}
                    <div className="space-y-3">
                      {category.warnings.map((warning, index) => {
                        const isChecked = reviewedWarnings[`${category.id}-${index}`];
                        return (
                          <button
                            key={index}
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            onClick={() => handleToggleWarning(category.id, index)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleToggleWarning(category.id, index);
                              }
                            }}
                            className={`w-full flex items-start gap-3 p-3 text-left transition-all duration-200 border ${
                              isChecked 
                                ? 'bg-white/5 border-[var(--primary)]/30' 
                                : 'bg-black/30 border-white/5 hover:border-white/20'
                            }`}
                            style={{
                              clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                            }}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isChecked ? 'bg-[var(--primary)]' : 'border border-white/20'
                            }`}>
                              {isChecked && <CheckIcon className="h-3 w-3 text-black" />}
                            </div>
                            <span className={`text-sm ${isChecked ? 'text-white' : 'text-white/60'}`}>
                              {warning}
                </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Category Progress */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="h-1 bg-white/5 overflow-hidden rounded-full">
                        <div 
                          className="h-full transition-all duration-500 rounded-full"
                          style={{ 
                            width: `${(categoryReviewed / category.warnings.length) * 100}%`,
                            backgroundColor: category.color
                          }}
                        />
                </div>
              </div>
            </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Protection Strategies */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Pill variant="success">安全策略</Pill>
            <h2 className="font-display text-3xl text-white mt-6">
              求职安全 <span className="italic font-light">防护策略</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {protectionStrategies.map((strategy, index) => {
              const StrategyIcon = strategy.icon;
              return (
                <div key={index} className="feature-card group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0"
                      style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                    >
                      <StrategyIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                        {strategy.title}
                      </h3>
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tips */}
                  <div className="pl-16 space-y-2">
                    {strategy.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-white/40">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Emergency Response */}
        <section>
          <div className="card bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 flex items-center justify-center"
                style={{ clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)' }}
              >
                <AlertCircleIcon className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">遇到诈骗怎么办？</h3>
                <p className="font-mono text-xs text-white/40">紧急应对措施</p>
        </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {emergencySteps.map((item, index) => (
                <div key={index} className="bg-black/30 border border-white/5 p-4"
                  style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                >
                  <div className="font-mono text-red-500 text-lg mb-2">{item.num}</div>
                  <p className="text-white/70 text-sm">{item.text}</p>
                </div>
              ))}
          </div>

            {/* Emergency Contacts */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 justify-center">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-red-500" />
                  <span className="font-mono text-sm text-white/60">{contact.label}：</span>
                  <span className="font-mono text-[var(--primary)]">{contact.number}</span>
        </div>
              ))}
        </div>
        </div>
        </section>
      </div>
    </div>
  );
};

export default AntiScamGuide;
