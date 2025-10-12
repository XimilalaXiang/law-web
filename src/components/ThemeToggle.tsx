import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

// 主题切换按钮（Neumorphic 风格）
const ThemeToggle: React.FC = () => {
  const { theme, preference, toggleTheme } = useTheme() as any;
  const { icon, label } = (() => {
    if (preference === 'system') return { icon: <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-300" />, label: '跟随系统' };
    if (theme === 'dark') return { icon: <Sun className="h-5 w-5 text-yellow-400" />, label: '深色' };
    return { icon: <Moon className="h-5 w-5 text-gray-600" />, label: '浅色' };
  })();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.12),-1px_-1px_5px_rgba(255,255,255,0.95)] dark:hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-1px_-1px_5px_rgba(255,255,255,0.03)] active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] dark:active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(255,255,255,0.05)] transition-all duration-300 flex items-center justify-center group"
      title={`主题：${label}（点击切换）`}
      aria-label={`主题：${label}（点击切换）`}
    >
      {icon}
    </button>
  );
};

export default ThemeToggle;
