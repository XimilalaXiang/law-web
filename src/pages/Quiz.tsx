import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import {
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  ArrowRightIcon,
  RotateCcwIcon,
  ShareIcon,
  ChevronLeftIcon,
  CloudIcon,
  UserPlusIcon,
  DownloadIcon,
  ImageIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  QuizQuestion,
  getRandomQuestions,
  difficultyConfig,
} from '../data/quizQuestions';

type GameState = 'intro' | 'playing' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

// Pill 组件
const Pill = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'danger' | 'success' }) => {
  const variantClasses = {
    default: '',
    danger: 'pill-danger',
    success: 'pill-success',
  };
  return <div className={`pill ${variantClasses[variant]}`}>{children}</div>;
};

const Quiz = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // 开始游戏
  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const config = difficultyConfig[selectedDifficulty];
    const selectedQuestions = getRandomQuestions(config.questions, selectedDifficulty);
    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setTimeLeft(config.time);
    setIsTimerActive(true);
    setGameState('playing');
  };

  // 计时器
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // 时间到，自动判错
      handleSubmitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  // 提交答案
  const handleSubmitAnswer = useCallback(() => {
    if (showExplanation) return;
    
    const currentQuestion = questions[currentIndex];
    const answer = selectedAnswer || '';
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect,
    }]);
    
    setShowExplanation(true);
    setIsTimerActive(false);
  }, [selectedAnswer, questions, currentIndex, showExplanation]);

  // 下一题
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(difficultyConfig[difficulty].time);
      setIsTimerActive(true);
    } else {
      setGameState('result');
    }
  };

  // 重新开始
  const restart = () => {
    setGameState('intro');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
  };

  const [isGenerating, setIsGenerating] = useState(false);

  // 下载证书为PNG图片
  const downloadCertificatePNG = async () => {
    if (!certificateRef.current || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#000000',
        scale: 2, // 2倍清晰度
        useCORS: true,
        allowTaint: true,
      });
      
      // 转换为PNG并下载
      const link = document.createElement('a');
      link.download = `SafeCareer_防骗证书_${user?.username || '匿名用户'}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成证书失败:', error);
      alert('生成证书失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 分享证书文本
  const shareCertificateText = () => {
    const text = `🏆 SafeCareer 防骗达人证书\n\n恭喜 ${user?.username || '匿名用户'} 同学\n在求职反诈测验中获得 ${score}/${total} 分（${percentage}%）\n\n快来测测你的防骗能力！\nhttps://safecareer.vercel.app/quiz`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('证书内容已复制到剪贴板，快去分享吧！');
    });
  };

  // 计算结果
  const score = answers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // 获取评价
  const getGrade = () => {
    if (percentage >= 90) return { text: '防骗大师', emoji: '🏆', color: '#FFC700' };
    if (percentage >= 70) return { text: '防骗专家', emoji: '🎓', color: '#22c55e' };
    if (percentage >= 50) return { text: '防骗学员', emoji: '📚', color: '#3b82f6' };
    return { text: '需要加强', emoji: '💪', color: '#f59e0b' };
  };

  const grade = getGrade();
  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-black min-h-screen w-full pt-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="vignette" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* ===== 介绍页 ===== */}
        {gameState === 'intro' && (
          <div className="text-center">
            <Pill variant="success">防骗测验</Pill>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mt-6">
              测测你的 <br className="sm:hidden" />
              <span className="italic font-light">防骗</span> 能力
            </h1>
            
            <p className="font-mono text-sm text-white/50 mt-6 max-w-lg mx-auto">
              通过情境题和选择题，检验你对求职诈骗的识别能力
            </p>

            {/* 难度选择 */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {(Object.entries(difficultyConfig) as [Difficulty, typeof difficultyConfig.easy][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => startGame(key)}
                  className="feature-card group cursor-pointer text-left hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 flex items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}50` }}
                    >
                      <PlayIcon className="h-5 w-5" style={{ color: config.color }} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{config.label}模式</div>
                      <div className="font-mono text-xs text-white/40">{config.questions}题 · {config.time}秒/题</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/60">开始测验</span>
                    <ArrowRightIcon className="h-4 w-4 text-white/40 group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* 规则说明 */}
            <div className="mt-16 card">
              <h3 className="text-lg font-semibold text-white mb-4">测验规则</h3>
              <div className="grid gap-4 md:grid-cols-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-sm text-[var(--primary)]">1</span>
                  </div>
                  <p className="text-white/60 text-sm">每道题限时作答，超时自动判错</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-sm text-[var(--primary)]">2</span>
                  </div>
                  <p className="text-white/60 text-sm">答题后可查看详细解析</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-sm text-[var(--primary)]">3</span>
                  </div>
                  <p className="text-white/60 text-sm">完成后可生成防骗证书分享</p>
                </div>
              </div>
            </div>

            {/* 未登录提示 */}
            {!user && (
              <div className="mt-8 card bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <CloudIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">登录后可保存测验成绩</p>
                      <p className="text-white/50 text-xs">云端同步学习进度，跨设备继续学习</p>
                    </div>
                  </div>
                  <Link 
                    to="/auth" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    注册/登录
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== 答题页 ===== */}
        {gameState === 'playing' && currentQuestion && (
          <div>
            {/* 顶部状态栏 */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={restart}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="font-mono text-sm">退出</span>
              </button>
              
              <div className="flex items-center gap-6">
                <div className="font-mono text-sm text-white/60">
                  {currentIndex + 1} / {questions.length}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  timeLeft <= 5 ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white/60'
                }`}>
                  <ClockIcon className="h-4 w-4" />
                  <span className="font-mono text-sm">{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* 题目卡片 */}
            <div className="card">
              {/* 情境描述 */}
              {currentQuestion.scenario && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                  <div className="font-mono text-xs text-[var(--primary)] mb-2">情境</div>
                  <p className="text-white/80 leading-relaxed">{currentQuestion.scenario}</p>
                </div>
              )}

              {/* 问题 */}
              <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h2>

              {/* 选项 */}
              <div className="space-y-3">
                {currentQuestion.options.map(option => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === currentQuestion.correctAnswer;
                  const showResult = showExplanation;
                  
                  let optionClass = 'border-white/10 hover:border-white/30';
                  if (showResult) {
                    if (isCorrect) {
                      optionClass = 'border-green-500 bg-green-500/10';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'border-red-500 bg-red-500/10';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-[var(--primary)] bg-[var(--primary)]/10';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => !showExplanation && setSelectedAnswer(option.id)}
                      disabled={showExplanation}
                      className={`w-full flex items-start gap-4 p-4 text-left border transition-all duration-200 rounded-lg ${optionClass}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-sm ${
                        showResult && isCorrect ? 'bg-green-500 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-[var(--primary)] text-black' : 'bg-white/10 text-white/60'
                      }`}>
                        {showResult && isCorrect ? <CheckCircleIcon className="h-4 w-4" /> :
                         showResult && isSelected && !isCorrect ? <XCircleIcon className="h-4 w-4" /> :
                         option.id.toUpperCase()}
                      </div>
                      <span className={`${showResult && isCorrect ? 'text-green-400' : 
                                        showResult && isSelected && !isCorrect ? 'text-red-400' : 'text-white/80'}`}>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 解析 */}
              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="font-mono text-xs text-blue-400 mb-2">解析</div>
                  <p className="text-white/80 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="mt-8 flex justify-end">
                {!showExplanation ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    确认答案
                  </button>
                ) : (
                  <button onClick={nextQuestion} className="btn-primary">
                    {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== 结果页 ===== */}
        {gameState === 'result' && (
          <div className="text-center">
            {/* 证书卡片 */}
            <div ref={certificateRef} className="card bg-gradient-to-br from-[#1a1a1a] to-black border-[var(--primary)]/30">
              <div className="text-6xl mb-4">{grade.emoji}</div>
              
              <Pill variant="success">测验完成</Pill>
              
              <h1 className="font-display text-4xl text-white mt-6">{grade.text}</h1>
              
              <div className="mt-8 flex justify-center gap-8">
                <div className="text-center">
                  <div className="font-display text-5xl" style={{ color: grade.color }}>{score}</div>
                  <div className="font-mono text-xs text-white/40 mt-1">正确</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-5xl text-white/40">{total - score}</div>
                  <div className="font-mono text-xs text-white/40 mt-1">错误</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-5xl text-[var(--primary)]">{percentage}%</div>
                  <div className="font-mono text-xs text-white/40 mt-1">正确率</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="font-mono text-sm text-white/60">
                  恭喜 <span className="text-[var(--primary)]">{user?.username || '匿名用户'}</span> 同学完成测验
                </p>
                <p className="font-mono text-xs text-white/40 mt-2">
                  SafeCareer · {new Date().toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={restart} className="btn-secondary">
                <RotateCcwIcon className="h-4 w-4 mr-2" />
                再测一次
              </button>
              <button 
                onClick={downloadCertificatePNG} 
                disabled={isGenerating}
                className="btn-primary disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
                    生成中...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    下载证书
                  </>
                )}
              </button>
              <button onClick={shareCertificateText} className="btn-secondary">
                <ShareIcon className="h-4 w-4 mr-2" />
                复制分享
              </button>
            </div>

            {/* 答题详情 */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-white mb-6">答题详情</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {answers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div 
                      key={index}
                      className={`card text-left ${answer.isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {answer.isCorrect ? 
                            <CheckCircleIcon className="h-4 w-4 text-white" /> : 
                            <XCircleIcon className="h-4 w-4 text-white" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm line-clamp-2">{question?.question}</p>
                          <p className="font-mono text-xs text-white/40 mt-2">
                            你的答案: {question?.options.find(o => o.id === answer.selectedAnswer)?.text || '未作答'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 返回链接 */}
            <div className="mt-12">
              <Link to="/guide" className="text-[var(--primary)] hover:underline font-mono text-sm">
                ← 返回反诈指南继续学习
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

