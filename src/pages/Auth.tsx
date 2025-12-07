import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  UserIcon,
  LockIcon, 
  EyeIcon, 
  EyeOffIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  LoaderIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WaveParticlesBackground from '../components/WaveParticlesBackground';

type AuthMode = 'login' | 'register';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // 用户名验证
    if (username.length < 3) {
      setError('用户名至少需要3个字符');
      setIsLoading(false);
      return;
    }

    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(username)) {
      setError('用户名只能包含中文、英文字母、数字和下划线');
      setIsLoading(false);
      return;
    }

    // 密码验证
    if (password.length < 6) {
      setError('密码至少需要6位');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('两次输入的密码不一致');
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(username, password);
        if (error) {
          setError(error);
        } else {
          setSuccess('注册成功！正在跳转...');
          setTimeout(() => navigate('/'), 1000);
        }
      } else {
        const { error } = await signIn(username, password);
        if (error) {
          setError(error);
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'login': return '欢迎回来';
      case 'register': return '创建账户';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'login': return '登录您的 SafeCareer 账户';
      case 'register': return '加入 SafeCareer，保护您的求职安全';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoaderIcon className="h-8 w-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0">
        <WaveParticlesBackground position="bottom" />
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="vignette" />
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--primary)]/30 rounded-xl transform scale-150 blur-xl opacity-50" />
            <ShieldCheckIcon className="h-10 w-10 text-[var(--primary)] relative z-10" />
          </div>
          <span className="ml-3 text-2xl font-semibold text-white">SafeCareer</span>
        </Link>

        {/* 主卡片 */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">{getModeTitle()}</h1>
            <p className="text-white/50 text-sm">{getModeDescription()}</p>
          </div>

          {/* 错误/成功提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">用户名</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="用户名（区分大小写）"
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
                />
              </div>
              <p className="mt-1.5 text-xs text-white/30">3-20位，支持中文、英文字母、数字、下划线（区分大小写）</p>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-white/70 text-sm mb-2">密码</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 确认密码 */}
            {mode === 'register' && (
              <div>
                <label className="block text-white/70 text-sm mb-2">确认密码</label>
                <div className="relative">
                  <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--primary)] to-[#EBB800] text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_8px_30px_rgba(255,199,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && '登录'}
                  {mode === 'register' && '注册'}
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* 注册/登录切换 */}
          <div className="mt-8 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-white/50">
                还没有账户？{' '}
                <button
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[var(--primary)] hover:underline font-medium"
                >
                  立即注册
                </button>
              </p>
            ) : (
              <p className="text-white/50">
                已有账户？{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[var(--primary)] hover:underline font-medium"
                >
                  立即登录
                </button>
              </p>
            )}
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
