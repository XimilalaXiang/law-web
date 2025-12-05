import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, ShieldCheckIcon, UserIcon, LogOutIcon, LogInIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavLink {
  path: string;
  label: string;
}

const navLinks: NavLink[] = [
  { path: '/', label: '首页' },
  { path: '/cases', label: '案例库' },
  { path: '/guide', label: '反诈指南' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, signOut, isLoading } = useAuth();

  // 获取当前激活链接的索引
  const activeIndex = navLinks.findIndex(link => link.path === location.pathname);

  // 计算指示器位置
  const updateIndicator = useCallback((index: number | null) => {
    if (index === null || !linkRefs.current[index]) {
      if (activeIndex >= 0 && linkRefs.current[activeIndex]) {
        const activeLink = linkRefs.current[activeIndex];
        if (activeLink) {
          setIndicatorStyle({
            left: activeLink.offsetLeft,
            width: activeLink.offsetWidth,
            opacity: 1,
          });
        }
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
      return;
    }

    const hoveredLink = linkRefs.current[index];
    if (hoveredLink) {
      setIndicatorStyle({
        left: hoveredLink.offsetLeft,
        width: hoveredLink.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeIndex]);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 初始化和路由变化时更新指示器
  useEffect(() => {
    requestAnimationFrame(() => {
      updateIndicator(hoveredIndex);
    });
  }, [location.pathname, hoveredIndex, updateIndicator]);

  // 窗口大小变化时重新计算
  useEffect(() => {
    const handleResize = () => updateIndicator(hoveredIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredIndex, updateIndicator]);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--primary)]/30 rounded-lg transform scale-150 group-hover:scale-175 transition-all duration-500 blur-xl opacity-0 group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-lg transform scale-125 transition-transform duration-300 blur-sm"></div>
              <ShieldCheckIcon className="h-7 w-7 md:h-8 md:w-8 text-[var(--primary)] relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="ml-3 text-lg md:text-xl font-semibold text-white tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
              SafeCareer
            </span>
          </Link>

          {/* Desktop Navigation with Sliding Indicator */}
          <div className="hidden md:flex items-center gap-4">
            <div 
              ref={navRef}
              className="relative flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10"
            >
              {/* Sliding Indicator */}
              <div
                className="absolute top-1 bottom-1 bg-white/10 rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  opacity: indicatorStyle.opacity,
                  boxShadow: hoveredIndex !== null || activeIndex >= 0 
                    ? '0 0 20px rgba(255, 199, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : 'none',
                }}
              />
              
              {/* Nav Links */}
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  ref={(el) => { linkRefs.current[index] = el; }}
                  to={link.path}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'text-[var(--primary)]' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="relative">
                    {link.label}
                    {isActive(link.path) && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_6px_var(--primary)]" />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            {/* 登录/用户按钮 */}
            {!isLoading && (
              isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[var(--primary)]/30 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#EBB800] flex items-center justify-center">
                      <UserIcon className="h-3.5 w-3.5 text-black" />
                    </div>
                    <span className="text-sm text-white/80 max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </button>

                  {/* 用户下拉菜单 */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs text-white/40">登录账户</p>
                        <p className="text-sm text-white truncate">@{user?.username}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                      >
                        <LogOutIcon className="h-4 w-4" />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[#EBB800] text-black font-medium text-sm rounded-full hover:shadow-[0_4px_15px_rgba(255,199,0,0.3)] transition-all duration-200"
                >
                  <LogInIcon className="h-4 w-4" />
                  登录
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile 登录按钮 */}
            {!isLoading && !isAuthenticated && (
              <Link
                to="/auth"
                className="p-2 bg-gradient-to-r from-[var(--primary)] to-[#EBB800] text-black rounded-lg"
              >
                <LogInIcon className="h-5 w-5" />
              </Link>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-white/80 hover:text-white transition-colors duration-200 group"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="relative">
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
                ) : (
                  <MenuIcon className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={() => setIsMenuOpen(false)}
        />

        <div className={`relative z-10 py-8 px-6 transition-all duration-500 ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`relative overflow-hidden font-mono text-lg uppercase tracking-wider py-4 px-4 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive(link.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full shadow-[0_0_10px_var(--primary)]" />
                )}
              </Link>
            ))}

            {/* Mobile 用户状态 */}
            {!isLoading && isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#EBB800] flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">已登录</p>
                    <p className="text-xs text-white/40 truncate max-w-[180px]">@{user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOutIcon className="h-5 w-5" />
                  退出登录
                </button>
              </div>
            )}
          </nav>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-white/30 text-center">
              SafeCareer · 守护你的职业安全
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
