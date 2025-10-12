import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * 使用主题的自定义钩子
 * @returns {ThemeContextType} 主题上下文对象
 * @throws {Error} 如果在ThemeProvider外部使用
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

