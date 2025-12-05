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

// 快速提问 - 深色科技风格
const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSelect, disabled = false }) => {
  return (
    <div className="w-full p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary)] mr-2 shadow-[0_0_8px_rgba(255,199,0,0.5)]"></span>
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
              className="group relative flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 transition-all duration-200 hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-white/5 disabled:hover:border-white/10"
            >
              {/* 图标 */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors duration-200">
                <IconComponent className="h-4 w-4 text-[var(--primary)]" />
              </div>

              {/* 文案 */}
              <span className="flex-1 text-left text-sm text-white/70 group-hover:text-white transition-colors duration-200">
                {question.label}
              </span>

              {/* Hover 装饰线 */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickQuestions;
