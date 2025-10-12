import React from 'react';
import { AlertTriangleIcon, HelpCircleIcon, SearchIcon, PhoneIcon } from 'lucide-react';
import type { QuickQuestion } from '../../types/chat';

interface QuickQuestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

// 快速提问模板
const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'analyze',
    label: '帮我分析招聘信息',
    prompt: '我想让你帮我分析一个招聘信息是否可靠',
    icon: 'search',
  },
  {
    id: 'training-loan',
    label: '什么是培训贷？',
    prompt: '什么是培训贷骗局？如何识别和防范？',
    icon: 'alert',
  },
  {
    id: 'black-agency',
    label: '如何识别黑中介？',
    prompt: '求职时如何识别黑中介？有哪些特征？',
    icon: 'help',
  },
  {
    id: 'scammed',
    label: '被骗了怎么办？',
    prompt: '如果不幸遭遇求职诈骗，应该怎么办？',
    icon: 'phone',
  },
];

const iconMap = {
  search: SearchIcon,
  alert: AlertTriangleIcon,
  help: HelpCircleIcon,
  phone: PhoneIcon,
};

/**
 * 快速提问组件 - 预设常见问题
 */
const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSelect, disabled = false }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
        快速提问
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_QUESTIONS.map((question) => {
          const IconComponent = iconMap[question.icon as keyof typeof iconMap] || HelpCircleIcon;
          
          return (
            <button
              key={question.id}
              onClick={() => !disabled && onSelect(question.prompt)}
              disabled={disabled}
              className="group relative flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-[3px_3px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.8)] border border-gray-100 transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(0,0,0,0.08),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:translate-y-[-1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {/* 图标 */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200">
                <IconComponent className="h-4 w-4 text-blue-600" />
              </div>
              
              {/* 文本 */}
              <span className="flex-1 text-left text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                {question.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickQuestions;

