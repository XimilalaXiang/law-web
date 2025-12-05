import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ShieldCheckIcon } from 'lucide-react';

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
  
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // 获取当前激活链接的索引
  const activeIndex = navLinks.findIndex(link => link.path === location.pathname);

  // 计算指示器位置
  const updateIndicator = useCallback((index: number | null) => {
    if (index === null || !linkRefs.current[index]) {
      // 没有悬停时显示当前激活项
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
    // 延迟一帧确保DOM已渲染
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

  const isActive = (path: string) => location.pathname === path;

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
              {/* Logo 光晕效果 */}
              <div className="absolute inset-0 bg-[var(--primary)]/30 rounded-lg transform scale-150 group-hover:scale-175 transition-all duration-500 blur-xl opacity-0 group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-lg transform scale-125 transition-transform duration-300 blur-sm"></div>
              <ShieldCheckIcon className="h-7 w-7 md:h-8 md:w-8 text-[var(--primary)] relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="ml-3 text-lg md:text-xl font-semibold text-white tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
              SafeCareer
            </span>
          </Link>

          {/* Desktop Navigation with Sliding Indicator */}
          <div className="hidden md:flex items-center">
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
                    {/* 激活状态下的小点指示器 */}
                    {isActive(link.path) && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_6px_var(--primary)]" />
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative p-2 text-white/80 hover:text-white transition-colors duration-200 group"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {/* 按钮背景效果 */}
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
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
                {/* 移动端激活指示条 */}
                {isActive(link.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full shadow-[0_0_10px_var(--primary)]" />
                )}
              </Link>
            ))}
          </nav>

          {/* 移动端底部装饰 */}
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
