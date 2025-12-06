import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, HeartIcon, MailIcon } from 'lucide-react';

const Footer = () => {
  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/cases', label: '案例库' },
    { path: '/guide', label: '防骗指南' },
    { path: '/quiz', label: '防骗测验' },
  ];

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* 背景装饰 */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-lg transform scale-110 blur-sm" />
                <ShieldCheckIcon className="h-6 w-6 text-[var(--primary)] relative z-10" />
              </div>
              <span className="ml-2 text-lg font-semibold text-white">
                SafeCareer
              </span>
            </div>
            <p className="mt-3 text-sm text-white/40 text-center md:text-left font-mono">
              保护大学生求职安全，远离就业诈骗
            </p>
          </div>

          {/* Slogan */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-white/40 flex items-center font-mono">
                <span>用</span>
                <HeartIcon className="h-4 w-4 text-red-500 mx-1.5 animate-pulse" />
                <span>守护每一位学生的职业梦想</span>
              </p>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/60 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.9)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-white/70 text-black shadow-lg shadow-[var(--primary)]/30">
                    <MailIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="tracking-wide">联系我们</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 px-4 py-3 text-[11px] text-white bg-black/80 border border-white/10 rounded-xl shadow-lg shadow-[var(--primary)]/20 backdrop-blur opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200">
                  <p className="text-[var(--primary)] font-semibold text-center mb-1">
                    邮件联系
                  </p>
                  <p className="font-mono text-xs text-white/70 whitespace-nowrap text-center">
                    admin@sysu-law.tech
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center md:justify-end space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="nav-link text-xs"
              >
                {link.label}
            </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30 font-mono">
              © {new Date().getFullYear()} SafeCareer. 保护你的求职安全，从这里开始。
          </p>
            
            {/* 装饰元素 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
              <span className="text-xs text-white/30 font-mono uppercase">
                系统运行中
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
