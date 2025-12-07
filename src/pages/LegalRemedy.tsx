import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CloudIcon,
  HardDriveIcon,
  TrophyIcon,
  PhoneIcon,
  FileTextIcon,
  ScaleIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  DownloadIcon,
  CopyIcon,
  CheckCircleIcon,
  InfoIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchLegalProgress,
  toggleCompletedStep,
  migrateLocalLegalToSupabase,
  saveDecisionPath,
  fetchDecisionPath,
} from '../lib/legalProgress';
import {
  evidenceCategories,
  preservationMethods,
  legalCategories,
  decisionTree,
  documentTemplates,
  emergencyContacts,
  getUnlockedAchievements,
  getNextAchievement,
  DecisionNode,
  DecisionResult,
} from '../data/legalRemedyContent';

// Pill component
const Pill = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'danger' | 'success' | 'warning' }) => {
  const variantClasses: Record<string, string> = {
    default: '',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  };
  return (
    <div className={`inline-flex items-center px-3 py-1 text-xs font-mono border rounded-full ${variantClasses[variant] || 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]'}`}>
      {children}
    </div>
  );
};

// 决策树组件
const DecisionTreeComponent = ({ 
  onComplete,
  userId,
}: { 
  onComplete: (result: DecisionResult) => void;
  userId: string | null;
}) => {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const currentNode = decisionTree.find(n => n.id === currentNodeId);

  const handleOptionClick = async (option: typeof currentNode extends DecisionNode ? DecisionNode['options'][0] : never) => {
    if (option.result) {
      setResult(option.result);
      onComplete(option.result);
      // 保存用户选择的路径
      if (userId) {
        await saveDecisionPath(userId, option.result.path);
      }
    } else if (option.nextNodeId) {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevNodeId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentNodeId(prevNodeId);
      setResult(null);
    }
  };

  const handleRestart = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setResult(null);
  };

  if (result) {
    const ResultIcon = result.icon;
    return (
      <div className="space-y-6">
        {/* Result Header */}
        <div 
          className="p-6 border rounded-lg"
          style={{ 
            backgroundColor: `${result.color}10`,
            borderColor: `${result.color}30`,
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-14 h-14 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: `${result.color}20`, border: `1px solid ${result.color}50` }}
            >
              <ResultIcon className="h-7 w-7" style={{ color: result.color }} />
            </div>
            <div>
              <div className="font-mono text-xs mb-1" style={{ color: result.color }}>{result.pathName}</div>
              <h3 className="text-xl font-semibold text-white">{result.title}</h3>
            </div>
          </div>
          <p className="text-white/70">{result.summary}</p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-[var(--primary)]" />
            行动步骤
          </h4>
          <div className="space-y-3">
            {result.steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ backgroundColor: `${result.color}20`, color: result.color }}
                >
                  {index + 1}
                </div>
                <span className="text-white/80 text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-yellow-400" />
            重要提示
          </h4>
          <div className="space-y-2">
            {result.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 mt-2 flex-shrink-0" />
                <span className="text-white/60 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-400" />
            需要准备的文书
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.documents.map((doc, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-mono"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            返回上一步
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all"
          >
            重新分析
          </button>
        </div>
      </div>
    );
  }

  if (!currentNode) return null;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-white/40 font-mono text-xs">
        <span>问题 {history.length + 1}</span>
        <span>/</span>
        <span>最多 {decisionTree.length} 步</span>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{currentNode.question}</h3>
        {currentNode.description && (
          <p className="text-white/50 text-sm">{currentNode.description}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentNode.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[var(--primary)]/30 transition-all group text-left"
          >
            <span className="text-white group-hover:text-[var(--primary)] transition-colors">
              {option.text}
            </span>
            <ChevronRightIcon className="h-5 w-5 text-white/40 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Back Button */}
      {history.length > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回上一步
        </button>
      )}
    </div>
  );
};

// 文书模板展示组件
const DocumentTemplateCard = ({ template }: { template: typeof documentTemplates[0] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const TemplateIcon = template.icon;

  const getFullTemplate = () => {
    return template.sections.map(s => `【${s.title}】\n${s.content}`).join('\n\n');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFullTemplate());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: `${template.color}20`, border: `1px solid ${template.color}50` }}
          >
            <TemplateIcon className="h-5 w-5" style={{ color: template.color }} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white">{template.title}</h4>
            <p className="text-xs text-white/40">{template.description}</p>
          </div>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isExpanded && (
        <div className="p-4 border-t border-white/10 space-y-4">
          {/* Applicable Scenarios */}
          <div className="flex flex-wrap gap-2">
            {template.applicableScenarios.map((scenario, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60"
              >
                {scenario}
              </span>
            ))}
          </div>

          {/* Template Sections */}
          <div className="space-y-3">
            {template.sections.map((section, index) => (
              <div key={index} className="p-3 bg-black/30 border border-white/5 rounded-lg">
                <div className="font-mono text-xs text-[var(--primary)] mb-1">【{section.title}】</div>
                <div className="text-sm text-white/70 whitespace-pre-wrap">{section.content}</div>
                {section.tips && (
                  <div className="mt-2 text-xs text-yellow-400/70 flex items-start gap-1">
                    <InfoIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {section.tips}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-[var(--primary)] text-sm hover:bg-[var(--primary)]/20 transition-all"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              {copied ? '已复制' : '复制模板'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 主页面组件
const LegalRemedy = () => {
  const { user, isAuthenticated } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSection, setActiveSection] = useState<'evidence' | 'legal' | 'decision' | 'documents' | 'contacts'>('evidence');
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);

  // 加载进度
  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const steps = await fetchLegalProgress(user?.id || null);
      const progressMap: Record<string, boolean> = {};
      steps.forEach(step => {
        progressMap[step] = true;
      });
      setCompletedSteps(progressMap);
    } catch (e) {
      console.error('加载进度失败:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 用户登录后迁移数据
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      migrateLocalLegalToSupabase(user.id).then(() => {
        loadProgress();
      });
    }
  }, [isAuthenticated, user?.id, loadProgress]);

  // 切换步骤完成状态
  const handleToggleStep = async (stepId: string) => {
    const currentlyCompleted = completedSteps[stepId] || false;
    
    setCompletedSteps(prev => ({ ...prev, [stepId]: !currentlyCompleted }));
    setIsSyncing(true);

    try {
      const success = await toggleCompletedStep(user?.id || null, stepId, currentlyCompleted);
      if (!success) {
        setCompletedSteps(prev => ({ ...prev, [stepId]: currentlyCompleted }));
      }
    } catch (e) {
      setCompletedSteps(prev => ({ ...prev, [stepId]: currentlyCompleted }));
      console.error('同步失败:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // 统计
  const totalSteps = 
    evidenceCategories.reduce((sum, cat) => sum + cat.items.length, 0) +
    preservationMethods.length +
    legalCategories.length +
    documentTemplates.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progress = Math.round((completedCount / totalSteps) * 100);

  // 成就
  const unlockedAchievements = getUnlockedAchievements(completedCount);
  const nextAchievement = getNextAchievement(completedCount);

  // 导航标签
  const sections = [
    { id: 'evidence', label: '证据固定', icon: FileTextIcon },
    { id: 'legal', label: '法律定性', icon: ScaleIcon },
    { id: 'decision', label: '路径决策', icon: ChevronRightIcon },
    { id: 'documents', label: '文书模板', icon: FileTextIcon },
    { id: 'contacts', label: '紧急联系', icon: PhoneIcon },
  ] as const;

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
        <div className="text-center mb-16">
          <Pill variant="warning">维权指南</Pill>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mt-6">
            求职诈骗 <br className="sm:hidden" />
            <span className="italic font-light">事后维权</span> 指南
          </h1>
          
          <p className="font-mono text-sm text-white/50 mt-6 max-w-lg mx-auto">
            如果不幸遭遇求职诈骗，这里有完整的法律救济方案帮助你维护权益
          </p>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">{evidenceCategories.length}</div>
              <div className="font-mono text-xs text-white/40 mt-1">证据类型</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">{legalCategories.length}</div>
              <div className="font-mono text-xs text-white/40 mt-1">法律定性</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">{documentTemplates.length}</div>
              <div className="font-mono text-xs text-white/40 mt-1">文书模板</div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="card mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center rounded-lg">
                <ShieldIcon className="h-5 w-5 text-[var(--primary)]" />
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
              <div className="font-mono text-xs text-white/40">{completedCount}/{totalSteps}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/5 overflow-hidden rounded-full mb-6">
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
                      {nextAchievement.title}（还差{nextAchievement.requiredSteps - completedCount}项）
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {sections.map(section => {
            const SectionIcon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-all ${
                  activeSection === section.id
                    ? 'bg-[var(--primary)] text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <SectionIcon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin mx-auto" />
            <p className="font-mono text-sm text-white/40 mt-4">加载中...</p>
          </div>
        ) : (
          <>
            {/* 证据固定 */}
            {activeSection === 'evidence' && (
              <section className="space-y-12">
                {/* Evidence Categories */}
                <div>
                  <div className="text-center mb-8">
                    <Pill>核心证据</Pill>
                    <h2 className="font-display text-2xl text-white mt-4">
                      证据固定 <span className="italic font-light">清单</span>
                    </h2>
                    <p className="font-mono text-sm text-white/40 mt-2">
                      点击标记已准备的证据类型
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    {evidenceCategories.map(category => {
                      const CategoryIcon = category.icon;
                      const categoryItems = category.items.map((_, i) => `evidence-${category.id}-${i}`);
                      const categoryCompleted = categoryItems.filter(id => completedSteps[id]).length;
                      
                      return (
                        <div key={category.id} className="card">
                          <div className="flex items-center gap-4 mb-6">
                            <div 
                              className="w-12 h-12 flex items-center justify-center rounded-lg"
                              style={{ 
                                backgroundColor: `${category.color}20`,
                                border: `1px solid ${category.color}50`,
                              }}
                            >
                              <CategoryIcon className="h-6 w-6" style={{ color: category.color }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                              <p className="text-xs text-white/40">{category.description}</p>
                            </div>
                            <div className="font-mono text-sm text-white/40">
                              {categoryCompleted}/{category.items.length}
                            </div>
                          </div>

                          <div className="space-y-4">
                            {category.items.map((item, index) => {
                              const stepId = `evidence-${category.id}-${index}`;
                              const isCompleted = completedSteps[stepId];
                              
                              return (
                                <div key={index} className="space-y-2">
                                  <button
                                    onClick={() => handleToggleStep(stepId)}
                                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
                                      isCompleted 
                                        ? 'bg-white/10 border border-[var(--primary)]/30' 
                                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                                    }`}
                                  >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                      isCompleted ? 'bg-[var(--primary)]' : 'border border-white/20'
                                    }`}>
                                      {isCompleted && <CheckIcon className="h-3 w-3 text-black" />}
                                    </div>
                                    <div className="text-left flex-1">
                                      <div className={`font-semibold ${isCompleted ? 'text-white' : 'text-white/70'}`}>
                                        {item.name}
                                      </div>
                                      <div className="mt-1 space-y-1">
                                        {item.details.slice(0, 2).map((detail, i) => (
                                          <div key={i} className="text-xs text-white/40 flex items-start gap-1">
                                            <span className="text-white/20">•</span>
                                            {detail}
                                          </div>
                                        ))}
                                        {item.details.length > 2 && (
                                          <div className="text-xs text-white/30">
                                            +{item.details.length - 2} 更多
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <span 
                                      className={`px-2 py-0.5 rounded text-xs font-mono ${
                                        item.importanceLevel === 'critical' 
                                          ? 'bg-red-500/20 text-red-400' 
                                          : item.importanceLevel === 'important'
                                          ? 'bg-yellow-500/20 text-yellow-400'
                                          : 'bg-blue-500/20 text-blue-400'
                                      }`}
                                    >
                                      {item.importanceLevel === 'critical' ? '必要' : item.importanceLevel === 'important' ? '重要' : '辅助'}
                                    </span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preservation Methods */}
                <div>
                  <div className="text-center mb-8">
                    <Pill variant="success">存证方法</Pill>
                    <h2 className="font-display text-2xl text-white mt-4">
                      证据保全 <span className="italic font-light">方法</span>
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {preservationMethods.map(method => {
                      const MethodIcon = method.icon;
                      const stepId = `preservation-${method.id}`;
                      const isCompleted = completedSteps[stepId];
                      
                      return (
                        <button
                          key={method.id}
                          onClick={() => handleToggleStep(stepId)}
                          className={`text-left p-4 rounded-lg transition-all ${
                            isCompleted 
                              ? 'bg-white/10 border border-[var(--primary)]/30' 
                              : 'bg-white/5 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                              isCompleted ? 'bg-[var(--primary)]' : 'border border-white/20'
                            }`}>
                              {isCompleted && <CheckIcon className="h-3 w-3 text-black" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <MethodIcon className="h-4 w-4" style={{ color: method.color }} />
                                <span className="font-semibold text-white">{method.title}</span>
                                <span 
                                  className={`px-2 py-0.5 rounded text-xs font-mono ${
                                    method.legalStrength === 'highest' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : method.legalStrength === 'high'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-white/10 text-white/40'
                                  }`}
                                >
                                  {method.legalStrength === 'highest' ? '效力最强' : method.legalStrength === 'high' ? '效力较强' : '效力一般'}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 mb-2">{method.description}</p>
                              <div className="text-xs text-[var(--primary)] font-mono">费用: {method.cost}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* 法律定性 */}
            {activeSection === 'legal' && (
              <section>
                <div className="text-center mb-8">
                  <Pill variant="danger">法律定性</Pill>
                  <h2 className="font-display text-2xl text-white mt-4">
                    常见违法行为 <span className="italic font-light">法律定性</span>
                  </h2>
                </div>

                {/* 分类标签 */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-white/60">刑事犯罪</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-xs text-white/60">行政违法</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-white/60">民事救济</span>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {legalCategories.map(category => {
                    const CategoryIcon = category.icon;
                    const stepId = `legal-${category.id}`;
                    const isCompleted = completedSteps[stepId];
                    
                    return (
                      <div 
                        key={category.id} 
                        className="card"
                        style={{ borderColor: `${category.color}30` }}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <button
                            onClick={() => handleToggleStep(stepId)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? 'bg-[var(--primary)]' : 'border border-white/20'
                            }`}
                          >
                            {isCompleted && <CheckIcon className="h-3 w-3 text-black" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CategoryIcon className="h-5 w-5" style={{ color: category.color }} />
                              <h3 className="font-semibold text-white">{category.title}</h3>
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-mono"
                                style={{ 
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              >
                                {category.typeName}
                              </span>
                            </div>
                            <p className="text-sm text-white/50 mt-1">{category.description}</p>
                          </div>
                        </div>

                        {/* Scenarios */}
                        <div className="mb-4">
                          <div className="text-xs text-white/40 mb-2">常见场景：</div>
                          <div className="space-y-1">
                            {category.scenarios.map((scenario, i) => (
                              <div key={i} className="text-xs text-white/60 flex items-start gap-2">
                                <span className="text-white/20">•</span>
                                {scenario}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Legal Basis */}
                        <div className="p-3 bg-black/30 rounded-lg mb-4">
                          <div className="text-xs text-[var(--primary)] font-mono mb-2">法律依据</div>
                          {category.legalBasis.map((basis, i) => (
                            <div key={i} className="text-xs text-white/60">
                              <span className="text-white/80">{basis.law} {basis.article}</span>
                              <div className="text-white/40 mt-0.5">{basis.content}</div>
                            </div>
                          ))}
                        </div>

                        {/* Threshold & Consequences */}
                        {category.threshold && (
                          <div className="text-xs text-yellow-400/80 mb-2">
                            ⚠️ 立案标准: {category.threshold}
                          </div>
                        )}
                        <div className="text-xs text-white/40">
                          <span className="text-white/60">法律后果：</span>
                          {category.consequences[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 路径决策 */}
            {activeSection === 'decision' && (
              <section>
                <div className="text-center mb-8">
                  <Pill variant="success">智能决策</Pill>
                  <h2 className="font-display text-2xl text-white mt-4">
                    救济路径 <span className="italic font-light">决策树</span>
                  </h2>
                  <p className="font-mono text-sm text-white/40 mt-2">
                    回答几个问题，为您推荐最适合的维权路径
                  </p>
                </div>

                <div className="card max-w-2xl mx-auto">
                  <DecisionTreeComponent 
                    onComplete={setDecisionResult}
                    userId={user?.id || null}
                  />
                </div>
              </section>
            )}

            {/* 文书模板 */}
            {activeSection === 'documents' && (
              <section>
                <div className="text-center mb-8">
                  <Pill>文书模板</Pill>
                  <h2 className="font-display text-2xl text-white mt-4">
                    法律文书 <span className="italic font-light">模板</span>
                  </h2>
                  <p className="font-mono text-sm text-white/40 mt-2">
                    点击展开查看详细模板，可一键复制使用
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  {documentTemplates.map(template => (
                    <DocumentTemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </section>
            )}

            {/* 紧急联系 */}
            {activeSection === 'contacts' && (
              <section>
                <div className="text-center mb-8">
                  <Pill variant="danger">紧急联系</Pill>
                  <h2 className="font-display text-2xl text-white mt-4">
                    紧急求助 <span className="italic font-light">热线</span>
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                  {emergencyContacts.map((contact, index) => {
                    const ContactIcon = contact.icon;
                    return (
                      <div 
                        key={index}
                        className="card text-center"
                        style={{ borderColor: `${contact.color}30` }}
                      >
                        <div 
                          className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: `${contact.color}20` }}
                        >
                          <ContactIcon className="h-6 w-6" style={{ color: contact.color }} />
                        </div>
                        <h3 className="font-semibold text-white mb-1">{contact.name}</h3>
                        <div 
                          className="font-mono text-2xl font-bold mb-2"
                          style={{ color: contact.color }}
                        >
                          {contact.number}
                        </div>
                        <p className="text-xs text-white/50">{contact.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Resources */}
                <div className="mt-12 card max-w-2xl mx-auto">
                  <h3 className="font-semibold text-white mb-4">其他求助渠道</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <ScaleIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">法律援助中心</div>
                        <div className="text-xs text-white/50">各地司法局设有法律援助中心，符合条件可获得免费法律帮助</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileTextIcon className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">人民法院在线服务</div>
                        <div className="text-xs text-white/50">通过微信小程序"人民法院在线服务"可进行网上立案</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangleIcon className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">国家反诈中心APP</div>
                        <div className="text-xs text-white/50">可举报诈骗线索、查询可疑账号/网址、获取预警保护</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LegalRemedy;

