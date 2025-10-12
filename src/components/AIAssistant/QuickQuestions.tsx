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
    prompt: '请帮我判断这条招聘信息是否可靠，并说明理由。',
    icon: 'search',
  },
  {
    id: 'training-loan',
    label: '什么是培训贷',
    prompt: '什么是培训贷？常见套路有哪些？如何识别和规避？',
    icon: 'alert',
  },
  {
    id: 'black-agency',
    label: '如何识别黑中介',
    prompt: '求职中如何识别黑中介？有哪些核验方式？',
    icon: 'help',
  },
  {
    id: 'scammed',
    label: '被骗了怎么办',
    prompt: '如果已经遇到求职诈骗，我现在应该怎么做？',
    icon: 'phone',
  },
];

const iconMap = {
  search: SearchIcon,
  alert: AlertTriangleIcon,
  help: HelpCircleIcon,
  phone: PhoneIcon,
};

// 快速提问：预置常用问题
const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSelect, disabled = false }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></span>
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
              className="group relative flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-[3px_3px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.3),-3px_-3px_8px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-600 transition-all duration-200 hover:shadow-[2px_2px_5px_rgba(0,0,0,0.08),-2px_-2px_5px_rgba(255,255,255,0.9)] dark:hover:shadow-[2px_2px_5px_rgba(0,0,0,0.4),-2px_-2px_5px_rgba(255,255,255,0.03)] hover:translate-y-[-1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {/* 图标 */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.02)] flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>

              {/* 文案 */}
              <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
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
