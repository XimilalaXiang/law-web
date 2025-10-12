import React from 'react';
import { MessageCircleIcon } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

/**
 * 悬浮按钮 - 唤起AI助手
 */
const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, hasUnread = false }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="打开AI防骗助手"
    >
      {/* 悬浮阴影层 */}
      <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
      
      {/* 主按钮 - Neumorphic风格 */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full shadow-[8px_8px_20px_rgba(59,130,246,0.3),-4px_-4px_15px_rgba(147,197,253,0.2)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.4),-4px_-4px_15px_rgba(59,130,246,0.1)] flex items-center justify-center transition-all duration-300 group-hover:shadow-[6px_6px_15px_rgba(59,130,246,0.4),-3px_-3px_10px_rgba(147,197,253,0.3)] dark:group-hover:shadow-[6px_6px_15px_rgba(0,0,0,0.5),-3px_-3px_10px_rgba(59,130,246,0.15)] group-hover:scale-105 group-active:scale-95 border border-blue-400/30 dark:border-blue-500/30">
        <MessageCircleIcon className="h-6 w-6 md:h-7 md:w-7 text-white" />
        
        {/* 未读提示点 */}
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg animate-pulse"></div>
        )}
      </div>

      {/* 脉冲动画圈 */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-400 dark:border-blue-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
    </button>
  );
};

export default FloatingButton;

