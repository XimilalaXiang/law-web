import React from 'react';
import { MessageCircleIcon } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

/**
 * 悬浮按钮 - 唤起AI助手（深色科技风格）
 */
const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, hasUnread = false }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="打开AI防骗助手"
    >
      {/* 外层发光效果 */}
      <div className="absolute inset-0 bg-[var(--primary)] rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
      
      {/* 脉冲动画圈 */}
      <div 
        className="absolute inset-0 border border-[var(--primary)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        }}
      />
      
      {/* 主按钮 - 斜角切角风格 */}
      <div 
        className="relative w-14 h-14 md:w-16 md:h-16 bg-black border border-[var(--primary)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--primary)]/10 group-hover:shadow-[0_0_30px_rgba(255,199,0,0.4)] group-active:scale-95"
        style={{
          clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
          boxShadow: 'inset 0 0 20px rgba(255, 199, 0, 0.1)',
        }}
      >
        <MessageCircleIcon className="h-6 w-6 md:h-7 md:w-7 text-[var(--primary)] group-hover:scale-110 transition-transform duration-300" />
        
        {/* 未读提示点 */}
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
        )}
        
        {/* 角落装饰线 */}
        <span className="absolute top-1 left-1 w-3 h-px bg-[var(--primary)]/50 -rotate-45 origin-left" />
        <span className="absolute bottom-1 right-1 w-3 h-px bg-[var(--primary)]/50 -rotate-45 origin-right" />
      </div>
    </button>
  );
};

export default FloatingButton;
